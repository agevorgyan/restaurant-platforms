import { DomainEvent } from '@saas/core';

export class DiscountPolicyCreated implements DomainEvent {
  public readonly dateTimeOccurred: Date;

  constructor(
    public readonly discountPolicyId: string,
    public readonly name: string,
    public readonly type: string
  ) {
    this.dateTimeOccurred = new Date();
  }

  getAggregateId(): string {
    return this.discountPolicyId;
  }
}

export class DiscountPolicyActivated implements DomainEvent {
  public readonly dateTimeOccurred: Date;

  constructor(public readonly discountPolicyId: string) {
    this.dateTimeOccurred = new Date();
  }

  getAggregateId(): string {
    return this.discountPolicyId;
  }
}

export class DiscountPolicyDeactivated implements DomainEvent {
  public readonly dateTimeOccurred: Date;

  constructor(public readonly discountPolicyId: string, public readonly reason?: string) {
    this.dateTimeOccurred = new Date();
  }

  getAggregateId(): string {
    return this.discountPolicyId;
  }
}

export class DiscountRuleAdded implements DomainEvent {
  public readonly dateTimeOccurred: Date;

  constructor(public readonly discountPolicyId: string, public readonly ruleId: string) {
    this.dateTimeOccurred = new Date();
  }

  getAggregateId(): string {
    return this.discountPolicyId;
  }
}

export class DiscountRuleRemoved implements DomainEvent {
  public readonly dateTimeOccurred: Date;

  constructor(public readonly discountPolicyId: string, public readonly ruleId: string) {
    this.dateTimeOccurred = new Date();
  }

  getAggregateId(): string {
    return this.discountPolicyId;
  }
}
