import { DomainEvent } from '@saas/core';
import { PricingRuleId } from '../value-objects/pricing-rule-id.value-object';
import { PricingRuleCode } from '../value-objects/pricing-rule-code.value-object';

export class PricingRuleCreated implements DomainEvent {
  public readonly dateTimeOccurred: Date;
  constructor(
    public readonly ruleId: PricingRuleId,
    public readonly ruleCode: PricingRuleCode
  ) {
    this.dateTimeOccurred = new Date();
  }
  getAggregateId(): string { return this.ruleId.value; }
}

export class PricingRuleActivated implements DomainEvent {
  public readonly dateTimeOccurred: Date;
  constructor(public readonly ruleId: PricingRuleId) {
    this.dateTimeOccurred = new Date();
  }
  getAggregateId(): string { return this.ruleId.value; }
}

export class PricingRuleDeactivated implements DomainEvent {
  public readonly dateTimeOccurred: Date;
  constructor(public readonly ruleId: PricingRuleId) {
    this.dateTimeOccurred = new Date();
  }
  getAggregateId(): string { return this.ruleId.value; }
}

export class PricingRuleArchived implements DomainEvent {
  public readonly dateTimeOccurred: Date;
  constructor(public readonly ruleId: PricingRuleId) {
    this.dateTimeOccurred = new Date();
  }
  getAggregateId(): string { return this.ruleId.value; }
}

export class PricingRulePublished implements DomainEvent {
  public readonly dateTimeOccurred: Date;
  constructor(
    public readonly ruleId: PricingRuleId,
    public readonly version: number
  ) {
    this.dateTimeOccurred = new Date();
  }
  getAggregateId(): string { return this.ruleId.value; }
}
