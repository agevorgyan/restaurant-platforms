export class EventId {
  constructor(public readonly value: string) {}
}

export class EventVersion {
  constructor(public readonly value: string) {}
}

export class EventType {
  constructor(public readonly value: string) {}
}

export class EventPayload {
  constructor(public readonly data: Record<string, any>) {}
}

export class EventMetadata {
  constructor(
    public readonly tenantId: string,
    public readonly timestamp: Date,
    public readonly signature?: string,
  ) {}
}

export class CorrelationId {
  constructor(public readonly value: string) {}
}

export class CausationId {
  constructor(public readonly value: string) {}
}

export class PartitionKey {
  constructor(public readonly value: string) {}
}

export class TopicName {
  constructor(public readonly value: string) {}
}

export class SubscriptionId {
  constructor(public readonly value: string) {}
}




export class DeadLetterReason {
  constructor(
    public readonly code: string,
    public readonly message: string,
  ) {}
}
