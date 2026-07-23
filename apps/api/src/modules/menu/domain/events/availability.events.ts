import { DomainEvent } from '@saas/core';

export class AvailabilityEvaluatedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(
    public readonly evaluationId: string,
    public readonly contextId: string,
    public readonly decision: string
  ) {}
  getAggregateId(): string { return this.evaluationId; }
}

export class AvailabilityChangedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly referenceId: string, public readonly newDecision: string) {}
  getAggregateId(): string { return this.referenceId; }
}

export class AvailabilityOverrideAppliedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly referenceId: string, public readonly overrideReason: string) {}
  getAggregateId(): string { return this.referenceId; }
}

export class AvailabilityRuleMatchedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly evaluationId: string, public readonly ruleName: string) {}
  getAggregateId(): string { return this.evaluationId; }
}

export class AvailabilityEvaluationFailedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly evaluationId: string, public readonly errorMessage: string) {}
  getAggregateId(): string { return this.evaluationId; }
}