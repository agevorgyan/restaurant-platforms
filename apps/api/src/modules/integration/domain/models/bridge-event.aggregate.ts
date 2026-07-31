/**
 * Enterprise Integration Event Bridge - Bridge Event Aggregate Root
 *
 * Manages external event translation lifecycle, correlation tracking,
 * canonical event wrapping (EventEnvelope), and publication to the Enterprise Event Processing Platform.
 */

import { BridgeStatus, EventSourceType, EventTargetType } from '../enums/bridge.enums';
import {
  BridgeEventId,
  ExternalEventId,
  EventCorrelationId,
  EventMetadata,
  EventEnvelope,
  EventTranslation,
  BridgeRoute,
} from '../value-objects/bridge-vo';
import { BaseDomainEvent } from '../events/connector.events';
import {
  ExternalEventReceivedEvent,
  EventTranslatedEvent,
  EventValidatedEvent,
  EventPublishedEvent,
  TranslationFailedEvent,
  BridgeDeadLetteredEvent,
  BridgeReplayRequestedEvent,
} from '../events/bridge.events';

export interface BridgeEventAggregateProps {
  id: BridgeEventId;
  tenantId: string;
  connectorId: string;
  externalEventId: ExternalEventId;
  sourceType: EventSourceType;
  targetType: EventTargetType;
  correlationId: EventCorrelationId;
  status: BridgeStatus;
  rawPayload: Record<string, unknown>;
  envelope?: EventEnvelope;
  route?: BridgeRoute;
  attemptCount: number;
  errorReason?: string;
  isReplay: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class BridgeEventAggregate {
  private domainEvents: BaseDomainEvent[] = [];

  private constructor(private props: BridgeEventAggregateProps) {}

  public static receive(params: {
    id?: BridgeEventId;
    tenantId: string;
    connectorId: string;
    externalEventId?: string;
    sourceType: EventSourceType;
    targetType?: EventTargetType;
    correlationId?: string;
    rawPayload: Record<string, unknown>;
    isReplay?: boolean;
  }): BridgeEventAggregate {
    const id = params.id || BridgeEventId.generate();
    const externalId = ExternalEventId.create(params.externalEventId);
    const correlationId = EventCorrelationId.create(params.correlationId);
    const targetType = params.targetType || EventTargetType.INTEGRATION_EVENT;

    const now = new Date();
    const aggregate = new BridgeEventAggregate({
      id,
      tenantId: params.tenantId,
      connectorId: params.connectorId,
      externalEventId: externalId,
      sourceType: params.sourceType,
      targetType,
      correlationId,
      status: BridgeStatus.RECEIVED,
      rawPayload: params.rawPayload || {},
      attemptCount: 0,
      isReplay: params.isReplay || false,
      createdAt: now,
      updatedAt: now,
    });

    aggregate.addDomainEvent(
      new ExternalEventReceivedEvent(
        id.getValue(),
        params.tenantId,
        externalId.getValue(),
        params.sourceType,
        now
      )
    );

    return aggregate;
  }

  // --- Getters ---
  public getId(): BridgeEventId { return this.props.id; }
  public getTenantId(): string { return this.props.tenantId; }
  public getConnectorId(): string { return this.props.connectorId; }
  public getExternalEventId(): ExternalEventId { return this.props.externalEventId; }
  public getSourceType(): EventSourceType { return this.props.sourceType; }
  public getTargetType(): EventTargetType { return this.props.targetType; }
  public getCorrelationId(): EventCorrelationId { return this.props.correlationId; }
  public getStatus(): BridgeStatus { return this.props.status; }
  public getRawPayload(): Record<string, unknown> { return this.props.rawPayload; }
  public getEnvelope(): EventEnvelope | undefined { return this.props.envelope; }
  public getRoute(): BridgeRoute | undefined { return this.props.route; }
  public getAttemptCount(): number { return this.props.attemptCount; }
  public getErrorReason(): string | undefined { return this.props.errorReason; }
  public isReplay(): boolean { return this.props.isReplay; }
  public getCreatedAt(): Date { return this.props.createdAt; }
  public getUpdatedAt(): Date { return this.props.updatedAt; }

  public getUncommittedEvents(): BaseDomainEvent[] { return [...this.domainEvents]; }
  public clearEvents(): void { this.domainEvents = []; }

  private addDomainEvent(event: BaseDomainEvent): void { this.domainEvents.push(event); }

  public markTranslated(translation: EventTranslation, route: BridgeRoute): void {
    const now = new Date();
    this.props.updatedAt = now;
    this.props.route = route;

    if (translation.errorReason) {
      this.props.status = BridgeStatus.FAILED;
      this.props.errorReason = translation.errorReason;
      this.addDomainEvent(
        new TranslationFailedEvent(this.getId().getValue(), this.getTenantId(), translation.errorReason, now)
      );
      return;
    }

    const metadata = EventMetadata.create({
      tenantId: this.getTenantId(),
      sourceType: this.getSourceType(),
      targetType: route.targetType,
      correlationId: this.getCorrelationId(),
      isReplay: this.props.isReplay,
    });

    this.props.envelope = EventEnvelope.create({
      eventName: route.targetEventType,
      metadata,
      payload: translation.translatedPayload,
    });

    this.props.status = BridgeStatus.TRANSLATED;
    this.addDomainEvent(
      new EventTranslatedEvent(this.getId().getValue(), this.getTenantId(), route.targetEventType, route.targetType, now)
    );
  }

  public markValidated(isValid: boolean, reason?: string): void {
    const now = new Date();
    this.props.updatedAt = now;

    if (isValid) {
      this.props.status = BridgeStatus.VALIDATED;
      this.addDomainEvent(
        new EventValidatedEvent(this.getId().getValue(), this.getTenantId(), true, now)
      );
    } else {
      this.props.status = BridgeStatus.FAILED;
      this.props.errorReason = reason || 'Event validation failed';
      this.addDomainEvent(
        new EventValidatedEvent(this.getId().getValue(), this.getTenantId(), false, now)
      );
    }
  }

  public markPublished(eventTopic: string): void {
    const now = new Date();
    this.props.status = BridgeStatus.PUBLISHED;
    this.props.updatedAt = now;

    const internalId = this.props.envelope?.internalEventId.getValue() || 'unknown';
    this.addDomainEvent(
      new EventPublishedEvent(this.getId().getValue(), this.getTenantId(), internalId, eventTopic, now)
    );
  }

  public recordFailure(reason: string): void {
    const now = new Date();
    this.props.attemptCount++;
    this.props.errorReason = reason;
    this.props.updatedAt = now;

    if (this.props.attemptCount >= 3) {
      this.props.status = BridgeStatus.DEAD_LETTER;
      this.addDomainEvent(
        new BridgeDeadLetteredEvent(this.getId().getValue(), this.getTenantId(), reason, this.props.attemptCount, now)
      );
    } else {
      this.props.status = BridgeStatus.FAILED;
      this.addDomainEvent(
        new TranslationFailedEvent(this.getId().getValue(), this.getTenantId(), reason, now)
      );
    }
  }

  public requestReplay(requestedBy: string): void {
    const now = new Date();
    this.props.isReplay = true;
    this.props.status = BridgeStatus.RECEIVED;
    this.props.updatedAt = now;

    this.addDomainEvent(
      new BridgeReplayRequestedEvent(this.getId().getValue(), this.getTenantId(), requestedBy, now)
    );
  }
}
