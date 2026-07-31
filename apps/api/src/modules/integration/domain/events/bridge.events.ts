/**
 * Enterprise Integration Event Bridge - Domain Events
 */

import { randomUUID } from 'crypto';
import { BaseDomainEvent } from './connector.events';
import { EventSourceType, EventTargetType } from '../enums/bridge.enums';

export class ExternalEventReceivedEvent implements BaseDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'ExternalEventReceived';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly externalEventId: string,
    public readonly sourceType: EventSourceType,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class EventTranslatedEvent implements BaseDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'EventTranslated';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly internalEventName: string,
    public readonly targetType: EventTargetType,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class EventValidatedEvent implements BaseDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'EventValidated';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly isValid: boolean,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class EventPublishedEvent implements BaseDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'EventPublished';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly internalEventId: string,
    public readonly eventTopic: string,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class TranslationFailedEvent implements BaseDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'TranslationFailed';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly reason: string,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class BridgeDeadLetteredEvent implements BaseDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'BridgeDeadLettered';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly reason: string,
    public readonly attemptCount: number,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class BridgeReplayRequestedEvent implements BaseDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'BridgeReplayRequested';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly requestedBy: string,
    public readonly timestamp: Date = new Date()
  ) {}
}

export type BridgeDomainEvent =
  | ExternalEventReceivedEvent
  | EventTranslatedEvent
  | EventValidatedEvent
  | EventPublishedEvent
  | TranslationFailedEvent
  | BridgeDeadLetteredEvent
  | BridgeReplayRequestedEvent;
