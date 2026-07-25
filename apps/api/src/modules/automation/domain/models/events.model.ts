import {
  EventId,
  EventType,
  EventPayload,
  EventMetadata,
  TopicName,
  SubscriptionId,
  DeadLetterReason,
} from '../value-objects';
import { EventStatus, DeliveryGuarantee } from '../enums/events.enums';

export class MessageEvent {
  constructor(
    public readonly id: EventId,
    public readonly type: EventType,
    public readonly payload: EventPayload,
    public readonly metadata: EventMetadata,
    public status: EventStatus = EventStatus.Pending,
    public readonly createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
  ) {}

  public publish(): void {
    this.status = EventStatus.Published;
    this.updatedAt = new Date();
  }

  public deliver(): void {
    this.status = EventStatus.Delivered;
    this.updatedAt = new Date();
  }

  public fail(): void {
    this.status = EventStatus.Failed;
    this.updatedAt = new Date();
  }
}

export class EventSubscription {
  constructor(
    public readonly id: SubscriptionId,
    public readonly topic: TopicName,
    public readonly deliveryGuarantee: DeliveryGuarantee,
    public readonly filterExpression?: string,
    public isEnabled: boolean = true,
    public readonly createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
  ) {}

  public disable(): void {
    this.isEnabled = false;
    this.updatedAt = new Date();
  }

  public enable(): void {
    this.isEnabled = true;
    this.updatedAt = new Date();
  }
}

export class DeadLetterEnvelope {
  constructor(
    public readonly eventId: EventId,
    public readonly originalTopic: TopicName,
    public readonly reason: DeadLetterReason,
    public readonly deadLetteredAt: Date = new Date(),
  ) {}
}
