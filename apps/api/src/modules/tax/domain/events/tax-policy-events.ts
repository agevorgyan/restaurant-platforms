import { DomainEvent } from '@saas/core';
import { TaxPolicyId } from '../value-objects/tax-policy-id.value-object';
import { TaxCode } from '../value-objects/tax-code.value-object';

export class TaxPolicyCreated implements DomainEvent {
  public readonly dateTimeOccurred: Date;
  constructor(
    public readonly policyId: TaxPolicyId,
    public readonly taxCode: TaxCode
  ) {
    this.dateTimeOccurred = new Date();
  }
  getAggregateId(): string { return this.policyId.value; }
}

export class TaxPolicyPublished implements DomainEvent {
  public readonly dateTimeOccurred: Date;
  constructor(public readonly policyId: TaxPolicyId) {
    this.dateTimeOccurred = new Date();
  }
  getAggregateId(): string { return this.policyId.value; }
}

export class TaxPolicyActivated implements DomainEvent {
  public readonly dateTimeOccurred: Date;
  constructor(public readonly policyId: TaxPolicyId) {
    this.dateTimeOccurred = new Date();
  }
  getAggregateId(): string { return this.policyId.value; }
}

export class TaxPolicyDeactivated implements DomainEvent {
  public readonly dateTimeOccurred: Date;
  constructor(public readonly policyId: TaxPolicyId) {
    this.dateTimeOccurred = new Date();
  }
  getAggregateId(): string { return this.policyId.value; }
}

export class TaxPolicyArchived implements DomainEvent {
  public readonly dateTimeOccurred: Date;
  constructor(public readonly policyId: TaxPolicyId) {
    this.dateTimeOccurred = new Date();
  }
  getAggregateId(): string { return this.policyId.value; }
}

export class TaxRuleAdded implements DomainEvent {
  public readonly dateTimeOccurred: Date;
  constructor(
    public readonly policyId: TaxPolicyId,
    public readonly ruleId: string
  ) {
    this.dateTimeOccurred = new Date();
  }
  getAggregateId(): string { return this.policyId.value; }
}

export class TaxRuleRemoved implements DomainEvent {
  public readonly dateTimeOccurred: Date;
  constructor(
    public readonly policyId: TaxPolicyId,
    public readonly ruleId: string
  ) {
    this.dateTimeOccurred = new Date();
  }
  getAggregateId(): string { return this.policyId.value; }
}
