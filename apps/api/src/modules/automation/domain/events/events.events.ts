import {
  EventId,
  EventType,
  SubscriptionId,
  TopicName,
  DeadLetterReason,
} from '../value-objects';

export class EventPublished {
  constructor(
    public readonly eventId: EventId,
    public readonly eventType: EventType,
    public readonly topicName: TopicName,
    public readonly timestamp: Date,
  ) {}
}

export class EventDelivered {
  constructor(
    public readonly eventId: EventId,
    public readonly subscriptionId: SubscriptionId,
    public readonly timestamp: Date,
  ) {}
}

export class EventProcessingStarted {
  constructor(
    public readonly eventId: EventId,
    public readonly subscriptionId: SubscriptionId,
    public readonly timestamp: Date,
  ) {}
}

export class EventProcessingCompleted {
  constructor(
    public readonly eventId: EventId,
    public readonly subscriptionId: SubscriptionId,
    public readonly timestamp: Date,
  ) {}
}

export class EventFailed {
  constructor(
    public readonly eventId: EventId,
    public readonly subscriptionId: SubscriptionId,
    public readonly reason: string,
    public readonly timestamp: Date,
  ) {}
}

export class EventReplayed {
  constructor(
    public readonly eventId: EventId,
    public readonly triggeredBy: string,
    public readonly timestamp: Date,
  ) {}
}

export class DeadLetterCreated {
  constructor(
    public readonly eventId: EventId,
    public readonly reason: DeadLetterReason,
    public readonly timestamp: Date,
  ) {}
}

export class SubscriptionCreated {
  constructor(
    public readonly subscriptionId: SubscriptionId,
    public readonly topicName: TopicName,
    public readonly timestamp: Date,
  ) {}
}
