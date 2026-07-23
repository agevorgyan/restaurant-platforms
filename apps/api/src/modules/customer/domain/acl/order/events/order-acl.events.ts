import { DomainEvent } from '@saas/core';

export class CustomerOrderIntegrationStartedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly correlationId: string, public readonly customerId: string) {}
  getAggregateId(): string { return this.customerId; }
}

export class CustomerOrderIntegrationCompletedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly correlationId: string, public readonly customerId: string) {}
  getAggregateId(): string { return this.customerId; }
}

export class CustomerOrderIntegrationFailedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly correlationId: string, public readonly customerId: string, public readonly reason: string) {}
  getAggregateId(): string { return this.customerId; }
}

export class CustomerStatisticsUpdatedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly customerId: string, public readonly orderCount: number) {}
  getAggregateId(): string { return this.customerId; }
}

export class CustomerEligibilityEvaluatedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly customerId: string, public readonly isEligible: boolean) {}
  getAggregateId(): string { return this.customerId; }
}