/**
 * Enterprise Webhook Platform - Webhook Delivery Aggregate Root
 *
 * Manages inbound webhook delivery lifecycle, signature verification status,
 * replay protection validation, retry counts, and dead letter queue routing.
 */

import { WebhookStatus, SignatureStatus, WebhookType } from '../enums/webhook.enums';
import {
  WebhookId,
  WebhookDeliveryId,
  WebhookEndpoint,
  WebhookSignature,
  WebhookPayload,
  WebhookHeaders,
  WebhookTimestamp,
  WebhookNonce,
  WebhookRetryPolicy,
} from '../value-objects/webhook-vo';
import { BaseDomainEvent } from '../events/connector.events';
import {
  WebhookReceivedEvent,
  SignatureVerifiedEvent,
  ReplayDetectedEvent,
  WebhookRejectedEvent,
  WebhookProcessedEvent,
  WebhookFailedEvent,
  WebhookDeadLetteredEvent,
  WebhookPublishedEvent,
} from '../events/webhook.events';

export interface WebhookDeliveryProps {
  id: WebhookId;
  tenantId: string;
  connectorId: string;
  type: WebhookType;
  deliveryId: WebhookDeliveryId;
  endpoint: WebhookEndpoint;
  signature?: WebhookSignature;
  signatureStatus: SignatureStatus;
  payload: WebhookPayload;
  headers: WebhookHeaders;
  timestamp: WebhookTimestamp;
  nonce: WebhookNonce;
  status: WebhookStatus;
  retryPolicy: WebhookRetryPolicy;
  attemptCount: number;
  errorDetails?: string;
  eventTopic?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class WebhookDeliveryAggregate {
  private domainEvents: BaseDomainEvent[] = [];

  private constructor(private props: WebhookDeliveryProps) {}

  public static receive(params: {
    id?: WebhookId;
    tenantId?: string;
    connectorId: string;
    type?: WebhookType;
    endpointPath: string;
    rawPayload: string | Buffer | object;
    headers: Record<string, string | string[] | undefined>;
    signatureStr?: string;
    timestampHeader?: string | number;
    nonceHeader?: string;
  }): WebhookDeliveryAggregate {
    const id = params.id || WebhookId.generate();
    const tenantId = params.tenantId || 'tenant-default';
    const deliveryId = WebhookDeliveryId.create();
    const endpoint = WebhookEndpoint.create(params.endpointPath);
    const payload = WebhookPayload.create(params.rawPayload);
    const headers = WebhookHeaders.create(params.headers);
    const timestamp = WebhookTimestamp.create(params.timestampHeader);
    const nonce = WebhookNonce.create(params.nonceHeader);
    const type = params.type || WebhookType.CUSTOM;

    const signature = params.signatureStr ? WebhookSignature.create(params.signatureStr) : undefined;
    const signatureStatus = signature ? SignatureStatus.MISSING : SignatureStatus.MISSING;

    const now = new Date();
    const aggregate = new WebhookDeliveryAggregate({
      id,
      tenantId,
      connectorId: params.connectorId,
      type,
      deliveryId,
      endpoint,
      signature,
      signatureStatus,
      payload,
      headers,
      timestamp,
      nonce,
      status: WebhookStatus.RECEIVED,
      retryPolicy: WebhookRetryPolicy.default(),
      attemptCount: 0,
      createdAt: now,
      updatedAt: now,
    });

    aggregate.addDomainEvent(
      new WebhookReceivedEvent(id.getValue(), tenantId, params.connectorId, deliveryId.getValue(), now)
    );

    return aggregate;
  }

  // --- Getters ---
  public getId(): WebhookId { return this.props.id; }
  public getTenantId(): string { return this.props.tenantId; }
  public getConnectorId(): string { return this.props.connectorId; }
  public getType(): WebhookType { return this.props.type; }
  public getDeliveryId(): WebhookDeliveryId { return this.props.deliveryId; }
  public getEndpoint(): WebhookEndpoint { return this.props.endpoint; }
  public getSignature(): WebhookSignature | undefined { return this.props.signature; }
  public getSignatureStatus(): SignatureStatus { return this.props.signatureStatus; }
  public getPayload(): WebhookPayload { return this.props.payload; }
  public getHeaders(): WebhookHeaders { return this.props.headers; }
  public getTimestamp(): WebhookTimestamp { return this.props.timestamp; }
  public getNonce(): WebhookNonce { return this.props.nonce; }
  public getStatus(): WebhookStatus { return this.props.status; }
  public getAttemptCount(): number { return this.props.attemptCount; }
  public getErrorDetails(): string | undefined { return this.props.errorDetails; }
  public getCreatedAt(): Date { return this.props.createdAt; }
  public getUpdatedAt(): Date { return this.props.updatedAt; }

  public getUncommittedEvents(): BaseDomainEvent[] { return [...this.domainEvents]; }
  public clearEvents(): void { this.domainEvents = []; }

  private addDomainEvent(event: BaseDomainEvent): void { this.domainEvents.push(event); }

  public markSignatureVerified(isValid: boolean, reason?: string): void {
    const now = new Date();
    this.props.updatedAt = now;

    if (isValid) {
      this.props.signatureStatus = SignatureStatus.VALID;
      this.props.status = WebhookStatus.VALIDATED;
      this.addDomainEvent(
        new SignatureVerifiedEvent(this.getId().getValue(), this.getTenantId(), this.getConnectorId(), SignatureStatus.VALID, now)
      );
    } else {
      this.props.signatureStatus = SignatureStatus.INVALID;
      this.props.status = WebhookStatus.REJECTED;
      this.props.errorDetails = reason || 'Signature verification failed';
      this.addDomainEvent(
        new SignatureVerifiedEvent(this.getId().getValue(), this.getTenantId(), this.getConnectorId(), SignatureStatus.INVALID, now)
      );
      this.addDomainEvent(
        new WebhookRejectedEvent(this.getId().getValue(), this.getTenantId(), this.getConnectorId(), this.props.errorDetails, now)
      );
    }
  }

  public markReplayDetected(reason: string): void {
    const now = new Date();
    this.props.status = WebhookStatus.REJECTED;
    this.props.errorDetails = `Replay attack detected: ${reason}`;
    this.props.updatedAt = now;

    this.addDomainEvent(
      new ReplayDetectedEvent(
        this.getId().getValue(),
        this.getTenantId(),
        this.getConnectorId(),
        this.getNonce().getValue(),
        reason,
        now
      )
    );
    this.addDomainEvent(
      new WebhookRejectedEvent(this.getId().getValue(), this.getTenantId(), this.getConnectorId(), this.props.errorDetails, now)
    );
  }

  public markProcessing(): void {
    this.props.attemptCount++;
    this.props.status = WebhookStatus.PROCESSING;
    this.props.updatedAt = new Date();
  }

  public markProcessed(processingTimeMs: number, eventTopic?: string): void {
    const now = new Date();
    this.props.status = WebhookStatus.PROCESSED;
    this.props.eventTopic = eventTopic;
    this.props.updatedAt = now;

    this.addDomainEvent(
      new WebhookProcessedEvent(this.getId().getValue(), this.getTenantId(), this.getConnectorId(), processingTimeMs, now)
    );
    if (eventTopic) {
      this.addDomainEvent(
        new WebhookPublishedEvent(this.getId().getValue(), this.getTenantId(), this.getConnectorId(), eventTopic, now)
      );
    }
  }

  public recordFailure(reason: string): void {
    const now = new Date();
    this.props.errorDetails = reason;
    this.props.updatedAt = now;

    if (this.props.attemptCount >= this.props.retryPolicy.maxAttempts) {
      this.props.status = WebhookStatus.DEAD_LETTER;
      this.addDomainEvent(
        new WebhookDeadLetteredEvent(
          this.getId().getValue(),
          this.getTenantId(),
          this.getConnectorId(),
          reason,
          this.props.attemptCount,
          now
        )
      );
    } else {
      this.props.status = WebhookStatus.FAILED;
      this.addDomainEvent(
        new WebhookFailedEvent(
          this.getId().getValue(),
          this.getTenantId(),
          this.getConnectorId(),
          this.props.attemptCount,
          reason,
          now
        )
      );
    }
  }
}
