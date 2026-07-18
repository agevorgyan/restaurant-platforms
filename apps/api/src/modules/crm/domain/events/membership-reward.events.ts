import { IDomainEvent } from './domain-event.interface';

export class MembershipProgramCreatedEvent implements IDomainEvent {
  public readonly eventName = 'MembershipProgramCreated';
  public readonly occurredOn = new Date();

  constructor(
    public readonly programId: string,
    public readonly restaurantId: string
  ) {}
}

export class MembershipProgramActivatedEvent implements IDomainEvent {
  public readonly eventName = 'MembershipProgramActivated';
  public readonly occurredOn = new Date();

  constructor(
    public readonly programId: string,
    public readonly restaurantId: string
  ) {}
}

export class MembershipTierChangedEvent implements IDomainEvent {
  public readonly eventName = 'MembershipTierChanged';
  public readonly occurredOn = new Date();

  constructor(
    public readonly programId: string,
    public readonly restaurantId: string
  ) {}
}

export class RewardPolicyCreatedEvent implements IDomainEvent {
  public readonly eventName = 'RewardPolicyCreated';
  public readonly occurredOn = new Date();

  constructor(
    public readonly policyId: string,
    public readonly restaurantId: string
  ) {}
}

export class RewardPolicyPublishedEvent implements IDomainEvent {
  public readonly eventName = 'RewardPolicyPublished';
  public readonly occurredOn = new Date();

  constructor(
    public readonly policyId: string,
    public readonly restaurantId: string
  ) {}
}

export class RewardRuleUpdatedEvent implements IDomainEvent {
  public readonly eventName = 'RewardRuleUpdated';
  public readonly occurredOn = new Date();

  constructor(
    public readonly policyId: string,
    public readonly ruleId: string
  ) {}
}
