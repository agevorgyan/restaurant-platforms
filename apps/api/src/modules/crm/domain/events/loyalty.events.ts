import { IDomainEvent } from './domain-event.interface';

export class LoyaltyAccountCreatedEvent implements IDomainEvent {
  public readonly eventName = 'LoyaltyAccountCreated';
  public readonly occurredOn = new Date();

  constructor(
    public readonly accountId: string,
    public readonly customerId: string,
    public readonly restaurantId: string
  ) {}
}

export class LoyaltyPointsEarnedEvent implements IDomainEvent {
  public readonly eventName = 'LoyaltyPointsEarned';
  public readonly occurredOn = new Date();

  constructor(
    public readonly accountId: string,
    public readonly transactionId: string,
    public readonly points: number
  ) {}
}

export class LoyaltyPointsRedeemedEvent implements IDomainEvent {
  public readonly eventName = 'LoyaltyPointsRedeemed';
  public readonly occurredOn = new Date();

  constructor(
    public readonly accountId: string,
    public readonly transactionId: string,
    public readonly points: number
  ) {}
}

export class LoyaltyPointsExpiredEvent implements IDomainEvent {
  public readonly eventName = 'LoyaltyPointsExpired';
  public readonly occurredOn = new Date();

  constructor(
    public readonly accountId: string,
    public readonly transactionId: string,
    public readonly points: number
  ) {}
}

export class LoyaltyTierChangedEvent implements IDomainEvent {
  public readonly eventName = 'LoyaltyTierChanged';
  public readonly occurredOn = new Date();

  constructor(
    public readonly accountId: string,
    public readonly oldTier: string,
    public readonly newTier: string
  ) {}
}
