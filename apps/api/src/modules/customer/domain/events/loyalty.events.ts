import { DomainEvent } from '@saas/core';

export class LoyaltyAccountCreatedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly accountId: string, public readonly customerId: string) {}
  getAggregateId(): string { return this.accountId; }
}

export class LoyaltyAccountActivatedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly accountId: string) {}
  getAggregateId(): string { return this.accountId; }
}

export class LoyaltyAccountSuspendedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly accountId: string) {}
  getAggregateId(): string { return this.accountId; }
}

export class LoyaltyAccountClosedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly accountId: string) {}
  getAggregateId(): string { return this.accountId; }
}

export class PointsEarnedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly accountId: string, public readonly amount: number) {}
  getAggregateId(): string { return this.accountId; }
}

export class PointsRedeemedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly accountId: string, public readonly amount: number) {}
  getAggregateId(): string { return this.accountId; }
}

export class PointsExpiredEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly accountId: string, public readonly amount: number) {}
  getAggregateId(): string { return this.accountId; }
}

export class PointsAdjustedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly accountId: string, public readonly amount: number) {}
  getAggregateId(): string { return this.accountId; }
}

export class TierChangedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly accountId: string, public readonly newTier: string) {}
  getAggregateId(): string { return this.accountId; }
}

export class RewardGrantedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly accountId: string, public readonly rewardId: string) {}
  getAggregateId(): string { return this.accountId; }
}

export class RewardRedeemedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly accountId: string, public readonly rewardId: string) {}
  getAggregateId(): string { return this.accountId; }
}