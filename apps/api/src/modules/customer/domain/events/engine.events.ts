import { DomainEvent } from '@saas/core';

export class LoyaltyEvaluationStartedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly executionId: string, public readonly accountId: string) {}
  getAggregateId(): string { return this.accountId; }
}

export class LoyaltyEvaluationCompletedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly executionId: string, public readonly accountId: string) {}
  getAggregateId(): string { return this.accountId; }
}

export class TierEvaluationCompletedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly executionId: string, public readonly accountId: string) {}
  getAggregateId(): string { return this.accountId; }
}

export class RewardEligibilityCalculatedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly executionId: string, public readonly accountId: string) {}
  getAggregateId(): string { return this.accountId; }
}

export class PointsCalculationCompletedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly executionId: string, public readonly accountId: string) {}
  getAggregateId(): string { return this.accountId; }
}

export class RuleExecutionFailedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly executionId: string, public readonly accountId: string, public readonly reason: string) {}
  getAggregateId(): string { return this.accountId; }
}