import { DomainEvent } from '@saas/core';
import { ChargePolicyId } from '../value-objects/charge-policy-id.value-object';
import { ChargeCode } from '../value-objects/charge-code.value-object';

export class ChargePolicyCreated implements DomainEvent {
  public readonly dateTimeOccurred: Date;
  constructor(
    public readonly policyId: ChargePolicyId,
    public readonly chargeCode: ChargeCode
  ) {
    this.dateTimeOccurred = new Date();
  }
  getAggregateId(): string { return this.policyId.value; }
}

export class ChargePolicyPublished implements DomainEvent {
  public readonly dateTimeOccurred: Date;
  constructor(public readonly policyId: ChargePolicyId, public readonly version: number) {
    this.dateTimeOccurred = new Date();
  }
  getAggregateId(): string { return this.policyId.value; }
}

export class ChargePolicyActivated implements DomainEvent {
  public readonly dateTimeOccurred: Date;
  constructor(public readonly policyId: ChargePolicyId) {
    this.dateTimeOccurred = new Date();
  }
  getAggregateId(): string { return this.policyId.value; }
}

export class ChargePolicyDeactivated implements DomainEvent {
  public readonly dateTimeOccurred: Date;
  constructor(public readonly policyId: ChargePolicyId) {
    this.dateTimeOccurred = new Date();
  }
  getAggregateId(): string { return this.policyId.value; }
}

export class ChargePolicyArchived implements DomainEvent {
  public readonly dateTimeOccurred: Date;
  constructor(public readonly policyId: ChargePolicyId) {
    this.dateTimeOccurred = new Date();
  }
  getAggregateId(): string { return this.policyId.value; }
}

export class ChargeRuleAdded implements DomainEvent {
  public readonly dateTimeOccurred: Date;
  constructor(
    public readonly policyId: ChargePolicyId,
    public readonly ruleId: string
  ) {
    this.dateTimeOccurred = new Date();
  }
  getAggregateId(): string { return this.policyId.value; }
}

export class ChargeRuleRemoved implements DomainEvent {
  public readonly dateTimeOccurred: Date;
  constructor(
    public readonly policyId: ChargePolicyId,
    public readonly ruleId: string
  ) {
    this.dateTimeOccurred = new Date();
  }
  getAggregateId(): string { return this.policyId.value; }
}
