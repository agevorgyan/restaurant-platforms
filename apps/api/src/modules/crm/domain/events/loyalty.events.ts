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

export class LoyaltyAccountCreatedEvent implements CustomerDomainEvent<{ accountId: string; customerId: string; restaurantId: string }> {
  public readonly eventName = 'LoyaltyAccountCreated';
  public readonly occurredOn: Date;
  public readonly payload: { accountId: string; customerId: string; restaurantId: string };
  public readonly metadata: CustomerEventMetadata;

  constructor(metadataOrId: CustomerEventMetadata | string, customerIdOrPayload?: string | any, restaurantId?: string) {
    if (metadataOrId instanceof CustomerEventMetadata) {
      this.metadata = metadataOrId;
      this.payload = customerIdOrPayload;
    } else {
      this.payload = { accountId: metadataOrId, customerId: customerIdOrPayload, restaurantId: restaurantId! };
      this.metadata = createMetadata(this.eventName, metadataOrId, 'LoyaltyAccount', restaurantId!);
    }
    this.occurredOn = this.metadata.occurredAt;
  }
}

export class LoyaltyPointsEarnedEvent implements CustomerDomainEvent<{ accountId: string; transactionId: string; points: number }> {
  public readonly eventName = 'LoyaltyPointsEarned';
  public readonly occurredOn: Date;
  public readonly payload: { accountId: string; transactionId: string; points: number };
  public readonly metadata: CustomerEventMetadata;

  constructor(metadataOrId: CustomerEventMetadata | string, transactionIdOrPayload?: string | any, points?: number) {
    if (metadataOrId instanceof CustomerEventMetadata) {
      this.metadata = metadataOrId;
      this.payload = transactionIdOrPayload;
    } else {
      this.payload = { accountId: metadataOrId, transactionId: transactionIdOrPayload, points: points! };
      this.metadata = createMetadata(this.eventName, metadataOrId, 'LoyaltyAccount', 'N/A');
    }
    this.occurredOn = this.metadata.occurredAt;
  }
}

export class LoyaltyPointsRedeemedEvent implements CustomerDomainEvent<{ accountId: string; transactionId: string; points: number }> {
  public readonly eventName = 'LoyaltyPointsRedeemed';
  public readonly occurredOn: Date;
  public readonly payload: { accountId: string; transactionId: string; points: number };
  public readonly metadata: CustomerEventMetadata;

  constructor(metadataOrId: CustomerEventMetadata | string, transactionIdOrPayload?: string | any, points?: number) {
    if (metadataOrId instanceof CustomerEventMetadata) {
      this.metadata = metadataOrId;
      this.payload = transactionIdOrPayload;
    } else {
      this.payload = { accountId: metadataOrId, transactionId: transactionIdOrPayload, points: points! };
      this.metadata = createMetadata(this.eventName, metadataOrId, 'LoyaltyAccount', 'N/A');
    }
    this.occurredOn = this.metadata.occurredAt;
  }
}

export class LoyaltyPointsExpiredEvent implements CustomerDomainEvent<{ accountId: string; transactionId: string; points: number }> {
  public readonly eventName = 'LoyaltyPointsExpired';
  public readonly occurredOn: Date;
  public readonly payload: { accountId: string; transactionId: string; points: number };
  public readonly metadata: CustomerEventMetadata;

  constructor(metadataOrId: CustomerEventMetadata | string, transactionIdOrPayload?: string | any, points?: number) {
    if (metadataOrId instanceof CustomerEventMetadata) {
      this.metadata = metadataOrId;
      this.payload = transactionIdOrPayload;
    } else {
      this.payload = { accountId: metadataOrId, transactionId: transactionIdOrPayload, points: points! };
      this.metadata = createMetadata(this.eventName, metadataOrId, 'LoyaltyAccount', 'N/A');
    }
    this.occurredOn = this.metadata.occurredAt;
  }
}

export class LoyaltyTierChangedEvent implements CustomerDomainEvent<{ accountId: string; oldTier: string; newTier: string }> {
  public readonly eventName = 'LoyaltyTierChanged';
  public readonly occurredOn: Date;
  public readonly payload: { accountId: string; oldTier: string; newTier: string };
  public readonly metadata: CustomerEventMetadata;

  constructor(metadataOrId: CustomerEventMetadata | string, oldTierOrPayload?: string | any, newTier?: string) {
    if (metadataOrId instanceof CustomerEventMetadata) {
      this.metadata = metadataOrId;
      this.payload = oldTierOrPayload;
    } else {
      this.payload = { accountId: metadataOrId, oldTier: oldTierOrPayload, newTier: newTier! };
      this.metadata = createMetadata(this.eventName, metadataOrId, 'LoyaltyAccount', 'N/A');
    }
    this.occurredOn = this.metadata.occurredAt;
  }
}
