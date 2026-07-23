import { DomainEvent } from '@saas/core';

export class MenuIntegrationStartedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly correlationId: string, public readonly eventType: string) {}
  getAggregateId(): string { return this.correlationId; }
}

export class MenuIntegrationCompletedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly correlationId: string, public readonly success: boolean) {}
  getAggregateId(): string { return this.correlationId; }
}

export class MenuIntegrationFailedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly correlationId: string, public readonly reason: string) {}
  getAggregateId(): string { return this.correlationId; }
}

export class ContractRejectedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly correlationId: string, public readonly contractId: string, public readonly reason: string) {}
  getAggregateId(): string { return this.correlationId; }
}

export class VersionMismatchDetectedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly correlationId: string, public readonly expected: string, public readonly actual: string) {}
  getAggregateId(): string { return this.correlationId; }
}

export class DuplicateEventIgnoredEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly correlationId: string, public readonly eventId: string) {}
  getAggregateId(): string { return this.correlationId; }
}

export class PoisonMessageDetectedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly correlationId: string, public readonly payloadPreview: string) {}
  getAggregateId(): string { return this.correlationId; }
}