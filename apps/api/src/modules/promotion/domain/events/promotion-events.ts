import { DomainEvent } from '@saas/core';

export class PromotionCreated implements DomainEvent {
  public readonly dateTimeOccurred: Date;
  constructor(
    public readonly promotionId: string,
    public readonly name: string,
    public readonly type: string
  ) {
    this.dateTimeOccurred = new Date();
  }
  public getAggregateId(): string { return this.promotionId; }
}

export class PromotionActivated implements DomainEvent {
  public readonly dateTimeOccurred: Date;
  constructor(
    public readonly promotionId: string
  ) {
    this.dateTimeOccurred = new Date();
  }
  public getAggregateId(): string { return this.promotionId; }
}

export class PromotionDeactivated implements DomainEvent {
  public readonly dateTimeOccurred: Date;
  constructor(
    public readonly promotionId: string
  ) {
    this.dateTimeOccurred = new Date();
  }
  public getAggregateId(): string { return this.promotionId; }
}

export class PromotionExpired implements DomainEvent {
  public readonly dateTimeOccurred: Date;
  constructor(
    public readonly promotionId: string
  ) {
    this.dateTimeOccurred = new Date();
  }
  public getAggregateId(): string { return this.promotionId; }
}

export class PromotionRuleAdded implements DomainEvent {
  public readonly dateTimeOccurred: Date;
  constructor(
    public readonly promotionId: string,
    public readonly ruleId: string,
    public readonly ruleType: string
  ) {
    this.dateTimeOccurred = new Date();
  }
  public getAggregateId(): string { return this.promotionId; }
}

export class PromotionRuleRemoved implements DomainEvent {
  public readonly dateTimeOccurred: Date;
  constructor(
    public readonly promotionId: string,
    public readonly ruleId: string
  ) {
    this.dateTimeOccurred = new Date();
  }
  public getAggregateId(): string { return this.promotionId; }
}
