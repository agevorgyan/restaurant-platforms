import { CustomerDomainEvent } from './core/customer-domain-event.interface';
import { CustomerEventMetadata } from './value-objects/customer-event-metadata.value-object';
import { CustomerEventVersion } from './value-objects/customer-event-version.value-object';

function createMetadata(eventName: string, aggregateId: string, aggregateType: string, restaurantId: string) {
  return new CustomerEventMetadata(
    Math.random().toString(36).substring(2, 15),
    eventName,
    new CustomerEventVersion('1.0.0'),
    aggregateId,
    aggregateType,
    restaurantId,
    new Date()
  );
}

export class MembershipProgramCreatedEvent implements CustomerDomainEvent<{ programId: string; restaurantId: string }> {
  public readonly eventName = 'MembershipProgramCreated';
  public readonly occurredOn: Date;
  public readonly payload: { programId: string; restaurantId: string };
  public readonly metadata: CustomerEventMetadata;

  constructor(metadataOrId: CustomerEventMetadata | string, restaurantIdOrPayload?: string | any) {
    if (metadataOrId instanceof CustomerEventMetadata) {
      this.metadata = metadataOrId;
      this.payload = restaurantIdOrPayload;
    } else {
      this.payload = { programId: metadataOrId, restaurantId: restaurantIdOrPayload };
      this.metadata = createMetadata(this.eventName, metadataOrId, 'MembershipProgram', restaurantIdOrPayload);
    }
    this.occurredOn = this.metadata.occurredAt;
  }
}

export class MembershipProgramActivatedEvent implements CustomerDomainEvent<{ programId: string; restaurantId: string }> {
  public readonly eventName = 'MembershipProgramActivated';
  public readonly occurredOn: Date;
  public readonly payload: { programId: string; restaurantId: string };
  public readonly metadata: CustomerEventMetadata;

  constructor(metadataOrId: CustomerEventMetadata | string, restaurantIdOrPayload?: string | any) {
    if (metadataOrId instanceof CustomerEventMetadata) {
      this.metadata = metadataOrId;
      this.payload = restaurantIdOrPayload;
    } else {
      this.payload = { programId: metadataOrId, restaurantId: restaurantIdOrPayload };
      this.metadata = createMetadata(this.eventName, metadataOrId, 'MembershipProgram', restaurantIdOrPayload);
    }
    this.occurredOn = this.metadata.occurredAt;
  }
}

export class MembershipTierChangedEvent implements CustomerDomainEvent<{ programId: string; restaurantId: string }> {
  public readonly eventName = 'MembershipTierChanged';
  public readonly occurredOn: Date;
  public readonly payload: { programId: string; restaurantId: string };
  public readonly metadata: CustomerEventMetadata;

  constructor(metadataOrId: CustomerEventMetadata | string, restaurantIdOrPayload?: string | any) {
    if (metadataOrId instanceof CustomerEventMetadata) {
      this.metadata = metadataOrId;
      this.payload = restaurantIdOrPayload;
    } else {
      this.payload = { programId: metadataOrId, restaurantId: restaurantIdOrPayload };
      this.metadata = createMetadata(this.eventName, metadataOrId, 'MembershipProgram', restaurantIdOrPayload);
    }
    this.occurredOn = this.metadata.occurredAt;
  }
}

export class RewardPolicyCreatedEvent implements CustomerDomainEvent<{ policyId: string; restaurantId: string }> {
  public readonly eventName = 'RewardPolicyCreated';
  public readonly occurredOn: Date;
  public readonly payload: { policyId: string; restaurantId: string };
  public readonly metadata: CustomerEventMetadata;

  constructor(metadataOrId: CustomerEventMetadata | string, restaurantIdOrPayload?: string | any) {
    if (metadataOrId instanceof CustomerEventMetadata) {
      this.metadata = metadataOrId;
      this.payload = restaurantIdOrPayload;
    } else {
      this.payload = { policyId: metadataOrId, restaurantId: restaurantIdOrPayload };
      this.metadata = createMetadata(this.eventName, metadataOrId, 'RewardPolicy', restaurantIdOrPayload);
    }
    this.occurredOn = this.metadata.occurredAt;
  }
}

export class RewardPolicyPublishedEvent implements CustomerDomainEvent<{ policyId: string; restaurantId: string }> {
  public readonly eventName = 'RewardPolicyPublished';
  public readonly occurredOn: Date;
  public readonly payload: { policyId: string; restaurantId: string };
  public readonly metadata: CustomerEventMetadata;

  constructor(metadataOrId: CustomerEventMetadata | string, restaurantIdOrPayload?: string | any) {
    if (metadataOrId instanceof CustomerEventMetadata) {
      this.metadata = metadataOrId;
      this.payload = restaurantIdOrPayload;
    } else {
      this.payload = { policyId: metadataOrId, restaurantId: restaurantIdOrPayload };
      this.metadata = createMetadata(this.eventName, metadataOrId, 'RewardPolicy', restaurantIdOrPayload);
    }
    this.occurredOn = this.metadata.occurredAt;
  }
}

export class RewardRuleUpdatedEvent implements CustomerDomainEvent<{ policyId: string; ruleId: string }> {
  public readonly eventName = 'RewardRuleUpdated';
  public readonly occurredOn: Date;
  public readonly payload: { policyId: string; ruleId: string };
  public readonly metadata: CustomerEventMetadata;

  constructor(metadataOrId: CustomerEventMetadata | string, ruleIdOrPayload?: string | any) {
    if (metadataOrId instanceof CustomerEventMetadata) {
      this.metadata = metadataOrId;
      this.payload = ruleIdOrPayload;
    } else {
      this.payload = { policyId: metadataOrId, ruleId: ruleIdOrPayload };
      this.metadata = createMetadata(this.eventName, metadataOrId, 'RewardPolicy', 'N/A');
    }
    this.occurredOn = this.metadata.occurredAt;
  }
}
