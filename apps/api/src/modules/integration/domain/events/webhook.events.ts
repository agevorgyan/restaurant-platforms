/**
 * Enterprise Webhook Platform - Domain Events
 */

import { randomUUID } from 'crypto';
import { WebhookStatus, SignatureStatus } from '../enums/webhook.enums';
import { BaseDomainEvent } from './connector.events';

export class WebhookReceivedEvent implements BaseDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'WebhookReceived';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly connectorId: string,
    public readonly deliveryId: string,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class SignatureVerifiedEvent implements BaseDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'SignatureVerified';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly connectorId: string,
    public readonly signatureStatus: SignatureStatus,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class ReplayDetectedEvent implements BaseDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'ReplayDetected';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly connectorId: string,
    public readonly nonce: string,
    public readonly reason: string,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class WebhookRejectedEvent implements BaseDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'WebhookRejected';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly connectorId: string,
    public readonly reason: string,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class WebhookProcessedEvent implements BaseDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'WebhookProcessed';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly connectorId: string,
    public readonly processingTimeMs: number,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class WebhookFailedEvent implements BaseDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'WebhookFailed';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly connectorId: string,
    public readonly attemptNumber: number,
    public readonly errorDetails: string,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class WebhookDeadLetteredEvent implements BaseDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'WebhookDeadLettered';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly connectorId: string,
    public readonly reason: string,
    public readonly totalAttempts: number,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class WebhookPublishedEvent implements BaseDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'WebhookPublished';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly connectorId: string,
    public readonly eventTopic: string,
    public readonly timestamp: Date = new Date()
  ) {}
}

export type WebhookDomainEvent =
  | WebhookReceivedEvent
  | SignatureVerifiedEvent
  | ReplayDetectedEvent
  | WebhookRejectedEvent
  | WebhookProcessedEvent
  | WebhookFailedEvent
  | WebhookDeadLetteredEvent
  | WebhookPublishedEvent;
