import { DomainEvent } from '@saas/core';

export class KitchenAvailabilityResolvedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly correlationId: string, public readonly isAvailable: boolean) {}
  getAggregateId(): string { return this.correlationId; }
}

export class InventoryAvailabilityResolvedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly correlationId: string, public readonly isAvailable: boolean) {}
  getAggregateId(): string { return this.correlationId; }
}

export class AvailabilityEvaluationCompletedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly correlationId: string, public readonly overallStatus: string) {}
  getAggregateId(): string { return this.correlationId; }
}

export class AvailabilityIntegrationFailedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly correlationId: string, public readonly reason: string) {}
  getAggregateId(): string { return this.correlationId; }
}

export class ReferenceValidationFailedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly correlationId: string, public readonly failedReferenceType: string) {}
  getAggregateId(): string { return this.correlationId; }
}