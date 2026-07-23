import { DomainEvent } from '@saas/core';

export class CustomerSegmentEvaluatedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly correlationId: string, public readonly customerId: string) {}
  getAggregateId(): string { return this.customerId; }
}

export class CampaignEligibilityEvaluatedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly correlationId: string, public readonly customerId: string) {}
  getAggregateId(): string { return this.customerId; }
}

export class ConsentEvaluatedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly correlationId: string, public readonly customerId: string) {}
  getAggregateId(): string { return this.customerId; }
}

export class MarketingIntegrationCompletedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly correlationId: string, public readonly customerId: string) {}
  getAggregateId(): string { return this.customerId; }
}

export class MarketingIntegrationFailedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly correlationId: string, public readonly customerId: string, public readonly reason: string) {}
  getAggregateId(): string { return this.customerId; }
}