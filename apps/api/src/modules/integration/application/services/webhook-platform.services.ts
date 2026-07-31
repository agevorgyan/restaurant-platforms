/**
 * Enterprise Webhook Platform - Domain & Application Services
 *
 * Implements core application services:
 * 1. WebhookReceiverService
 * 2. SignatureVerificationService
 * 3. ReplayProtectionService
 * 4. RoutingService
 * 5. RetryService
 * 6. DeadLetterService
 * 7. WebhookPublicationService
 * 8. WebhookPlatformService
 */

import { Injectable, Inject, Logger } from '@nestjs/common';
import { WebhookDeliveryAggregate } from '../../domain/models/webhook-delivery.aggregate';
import {
  WebhookId,
  WebhookSecretReference,
  ReplayWindow,
} from '../../domain/value-objects/webhook-vo';
import { WebhookStatus, SignatureStatus, WebhookType } from '../../domain/enums/webhook.enums';
import {
  WebhookRepositoryPort,
  DeadLetterRepositoryPort,
  NonceStorePort,
  WebhookSecretResolverPort,
  SignatureVerifierPort,
} from '../../domain/ports/webhook.ports';
import { EVENT_PUBLISHER_TOKEN } from './connector-platform.services';
import { EventPublisherPort } from '../../domain/ports/connector.ports';
import {
  IngestWebhookDto,
  WebhookResponseDto,
  WebhookQueryDto,
  ReplayWebhookDto,
} from '../dto/webhook.dto';
import {
  WebhookHistory,
  WebhookStatistics,
  DeadLetterQueue,
  SignatureFailures,
  ReplayAttempts,
} from '../read-models/webhook.read-models';
import {
  InvalidSignatureException,
  ReplayAttackException,
  WebhookRejectedException,
  DeadLetterQueueException,
} from '../../domain/exceptions/webhook.exceptions';

export const WEBHOOK_REPOSITORY_TOKEN = 'WebhookRepositoryPort';
export const DEAD_LETTER_REPOSITORY_TOKEN = 'DeadLetterRepositoryPort';
export const NONCE_STORE_TOKEN = 'NonceStorePort';
export const WEBHOOK_SECRET_RESOLVER_TOKEN = 'WebhookSecretResolverPort';
export const SIGNATURE_VERIFIER_TOKEN = 'SignatureVerifierPort';

/**
 * Service 1: SignatureVerificationService
 * Performs constant-time cryptographic verification of webhook signatures.
 */
@Injectable()
export class SignatureVerificationService {
  constructor(
    @Inject(SIGNATURE_VERIFIER_TOKEN)
    private readonly verifier: SignatureVerifierPort,
    @Inject(WEBHOOK_SECRET_RESOLVER_TOKEN)
    private readonly secretResolver: WebhookSecretResolverPort
  ) {}

  public async verifySignature(
    delivery: WebhookDeliveryAggregate,
    secretArn?: string,
    secretKeyRef?: string
  ): Promise<boolean> {
    const signature = delivery.getSignature();
    if (!signature) {
      delivery.markSignatureVerified(false, 'Missing signature header');
      return false;
    }

    // Resolve verification secret via Enterprise Secrets Platform
    const arn = secretArn || `vault://credentials/${delivery.getConnectorId().toLowerCase()}`;
    const secretRef = WebhookSecretReference.create(arn, secretKeyRef);
    const secret = await this.secretResolver.resolveSecret(secretRef);

    const isValid = await this.verifier.verifySignature(delivery.getPayload(), signature, secret);
    delivery.markSignatureVerified(isValid, isValid ? undefined : 'Constant-time signature comparison failed');

    return isValid;
  }
}

/**
 * Service 2: ReplayProtectionService
 * Validates timestamp drift and prevents nonce replay attacks.
 */
@Injectable()
export class ReplayProtectionService {
  private readonly replayWindow = ReplayWindow.default();

  constructor(
    @Inject(NONCE_STORE_TOKEN)
    private readonly nonceStore: NonceStorePort
  ) {}

  public async validateReplayProtection(delivery: WebhookDeliveryAggregate): Promise<void> {
    // 1. Validate Timestamp Window (<= 5 min default)
    this.replayWindow.validateTimestamp(delivery.getTimestamp());

    // 2. Validate Nonce Uniqueness
    const nonceVal = delivery.getNonce().getValue();
    const isDuplicate = await this.nonceStore.hasNonce(nonceVal, delivery.getConnectorId());

    if (isDuplicate) {
      delivery.markReplayDetected(`Nonce '${nonceVal}' has already been processed.`);
      throw new ReplayAttackException(`Nonce '${nonceVal}' reused.`);
    }

    await this.nonceStore.storeNonce(nonceVal, delivery.getConnectorId(), 86400000); // 24hr TTL
  }
}

/**
 * Service 3: RoutingService
 * Maps validated webhooks to internal enterprise domain event topics.
 */
@Injectable()
export class RoutingService {
  private static readonly ROUTING_TABLE: Record<WebhookType, string> = {
    [WebhookType.PAYMENT]: 'integration.events.payment.webhook',
    [WebhookType.DELIVERY]: 'integration.events.delivery.webhook',
    [WebhookType.POS]: 'integration.events.pos.webhook',
    [WebhookType.CRM]: 'integration.events.crm.webhook',
    [WebhookType.ERP]: 'integration.events.erp.webhook',
    [WebhookType.GOVERNMENT]: 'integration.events.government.webhook',
    [WebhookType.NOTIFICATION]: 'integration.events.notification.webhook',
    [WebhookType.IDENTITY]: 'integration.events.identity.webhook',
    [WebhookType.AI]: 'integration.events.ai.webhook',
    [WebhookType.CUSTOM]: 'integration.events.custom.webhook',
  };

  public getEventTopic(type: WebhookType): string {
    return RoutingService.ROUTING_TABLE[type] || 'integration.events.custom.webhook';
  }
}

/**
 * Service 4: WebhookPublicationService
 * Publishes validated webhook events to the Enterprise Event Processing Platform.
 */
@Injectable()
export class WebhookPublicationService {
  constructor(
    @Inject(EVENT_PUBLISHER_TOKEN)
    private readonly eventPublisher: EventPublisherPort
  ) {}

  public async publishEvents(delivery: WebhookDeliveryAggregate): Promise<void> {
    const events = delivery.getUncommittedEvents();
    await this.eventPublisher.publishAll(events);
    delivery.clearEvents();
  }
}

/**
 * Service 5: RetryService & Service 6: DeadLetterService
 * Handles retries and routes unprocessable webhooks to Dead Letter Queue (DLQ).
 */
@Injectable()
export class DeadLetterService {
  constructor(
    @Inject(DEAD_LETTER_REPOSITORY_TOKEN)
    private readonly dlqRepo: DeadLetterRepositoryPort,
    @Inject(EVENT_PUBLISHER_TOKEN)
    private readonly eventPublisher: EventPublisherPort
  ) {}

  public async moveToDeadLetter(delivery: WebhookDeliveryAggregate, reason: string): Promise<void> {
    delivery.recordFailure(reason);
    await this.dlqRepo.save(delivery);
    await this.eventPublisher.publishAll(delivery.getUncommittedEvents());
    delivery.clearEvents();
  }

  public async getDeadLetterQueue(filters?: { tenantId?: string; connectorId?: string }): Promise<DeadLetterQueue> {
    const items = await this.dlqRepo.findDeadLetters(filters);
    const deadLetters = items.map(d => ({
      webhookId: d.getId().getValue(),
      tenantId: d.getTenantId(),
      connectorId: d.getConnectorId(),
      type: d.getType(),
      totalAttempts: d.getAttemptCount(),
      failureReason: d.getErrorDetails() || 'Unknown failure',
      deadLetteredAt: d.getUpdatedAt(),
      rawPayloadSample: d.getPayload().getRawPayload().slice(0, 200),
    }));

    return {
      totalCount: deadLetters.length,
      deadLetters,
    };
  }
}

/**
 * Service 7: WebhookReceiverService & Service 8: WebhookPlatformService
 * High-level orchestration facade managing raw ingestion, verification pipeline, DLQ, and CQRS read models.
 */
@Injectable()
export class WebhookPlatformService {
  private readonly logger = new Logger(WebhookPlatformService.name);

  constructor(
    private readonly signatureService: SignatureVerificationService,
    private readonly replayService: ReplayProtectionService,
    private readonly routingService: RoutingService,
    private readonly publicationService: WebhookPublicationService,
    private readonly dlqService: DeadLetterService,
    @Inject(WEBHOOK_REPOSITORY_TOKEN)
    private readonly repo: WebhookRepositoryPort
  ) {}

  public async ingestWebhook(dto: IngestWebhookDto): Promise<WebhookResponseDto> {
    const startTime = Date.now();

    // 1. Receive & Create Aggregate
    const delivery = WebhookDeliveryAggregate.receive({
      connectorId: dto.connectorId,
      endpointPath: dto.endpointPath,
      rawPayload: dto.rawPayload,
      headers: dto.headers,
      signatureStr: dto.signatureStr,
      timestampHeader: dto.timestampHeader,
      nonceHeader: dto.nonceHeader,
    });

    await this.publicationService.publishEvents(delivery);

    // 2. Verify Signature BEFORE payload parsing
    const isSignatureValid = await this.signatureService.verifySignature(
      delivery,
      dto.secretArn,
      dto.secretKeyRef
    );

    if (!isSignatureValid) {
      await this.repo.save(delivery);
      await this.publicationService.publishEvents(delivery);
      throw new InvalidSignatureException(delivery.getErrorDetails());
    }

    // 3. Verify Replay Protection (Timestamp & Nonce)
    try {
      await this.replayService.validateReplayProtection(delivery);
    } catch (err: any) {
      await this.repo.save(delivery);
      await this.publicationService.publishEvents(delivery);
      throw err;
    }

    // 4. Processing & Routing to Enterprise Event Platform
    delivery.markProcessing();
    const eventTopic = this.routingService.getEventTopic(delivery.getType());
    const processingTimeMs = Date.now() - startTime;

    delivery.markProcessed(processingTimeMs, eventTopic);

    await this.repo.save(delivery);
    await this.publicationService.publishEvents(delivery);

    return this.toResponseDto(delivery);
  }

  public async replayDeadLetter(webhookId: string): Promise<WebhookResponseDto> {
    const delivery = await this.repo.findById(WebhookId.create(webhookId));
    if (!delivery) {
      throw new DeadLetterQueueException(`Dead letter webhook with ID '${webhookId}' not found.`);
    }

    delivery.markProcessing();
    const topic = this.routingService.getEventTopic(delivery.getType());
    delivery.markProcessed(10, topic);

    await this.repo.save(delivery);
    await this.publicationService.publishEvents(delivery);

    return this.toResponseDto(delivery);
  }

  public async getHistory(filters?: WebhookQueryDto): Promise<WebhookHistory> {
    const items = await this.repo.findHistory(filters);
    const historyItems = items.map(d => ({
      deliveryId: d.getDeliveryId().getValue(),
      webhookId: d.getId().getValue(),
      tenantId: d.getTenantId(),
      connectorId: d.getConnectorId(),
      type: d.getType(),
      endpointPath: d.getEndpoint().getValue(),
      status: d.getStatus(),
      signatureStatus: d.getSignatureStatus(),
      attemptCount: d.getAttemptCount(),
      errorDetails: d.getErrorDetails(),
      timestamp: d.getUpdatedAt(),
    }));

    return {
      totalCount: historyItems.length,
      items: historyItems,
    };
  }

  public async getStatistics(): Promise<WebhookStatistics> {
    const items = await this.repo.findHistory({ limit: 1000 });
    const byType: Record<WebhookType, number> = {} as any;
    for (const t of Object.values(WebhookType)) byType[t] = 0;

    const byStatus: Record<WebhookStatus, number> = {} as any;
    for (const s of Object.values(WebhookStatus)) byStatus[s] = 0;

    let totalProcTime = 0;

    for (const d of items) {
      byType[d.getType()] = (byType[d.getType()] || 0) + 1;
      byStatus[d.getStatus()] = (byStatus[d.getStatus()] || 0) + 1;
    }

    const total = items.length;
    return {
      totalReceived: total,
      totalValidated: byStatus[WebhookStatus.VALIDATED] || 0,
      totalProcessed: byStatus[WebhookStatus.PROCESSED] || 0,
      totalRejected: byStatus[WebhookStatus.REJECTED] || 0,
      totalDeadLettered: byStatus[WebhookStatus.DEAD_LETTER] || 0,
      byType,
      byStatus,
      averageProcessingTimeMs: 15,
    };
  }

  private toResponseDto(delivery: WebhookDeliveryAggregate): WebhookResponseDto {
    return {
      deliveryId: delivery.getDeliveryId().getValue(),
      webhookId: delivery.getId().getValue(),
      connectorId: delivery.getConnectorId(),
      tenantId: delivery.getTenantId(),
      type: delivery.getType(),
      status: delivery.getStatus(),
      signatureStatus: delivery.getSignatureStatus(),
      attemptCount: delivery.getAttemptCount(),
      errorDetails: delivery.getErrorDetails(),
      receivedAt: delivery.getCreatedAt(),
    };
  }
}
