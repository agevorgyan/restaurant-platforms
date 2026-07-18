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

export class CustomerWalletCreatedEvent implements CustomerDomainEvent<{ walletId: string; customerId: string; walletNumber: string }> {
  public readonly eventName = 'CustomerWalletCreated';
  public readonly occurredOn: Date;
  public readonly payload: { walletId: string; customerId: string; walletNumber: string };
  public readonly metadata: CustomerEventMetadata;

  constructor(metadataOrId: CustomerEventMetadata | string, customerIdOrPayload?: string | any, walletNumber?: string) {
    if (metadataOrId instanceof CustomerEventMetadata) {
      this.metadata = metadataOrId;
      this.payload = customerIdOrPayload;
    } else {
      this.payload = { walletId: metadataOrId, customerId: customerIdOrPayload, walletNumber: walletNumber! };
      this.metadata = createMetadata(this.eventName, metadataOrId, 'CustomerWallet', 'N/A');
    }
    this.occurredOn = this.metadata.occurredAt;
  }
}

export class WalletCreditedEvent implements CustomerDomainEvent<{ walletId: string; transactionId: string; amount: number }> {
  public readonly eventName = 'WalletCredited';
  public readonly occurredOn: Date;
  public readonly payload: { walletId: string; transactionId: string; amount: number };
  public readonly metadata: CustomerEventMetadata;

  constructor(metadataOrId: CustomerEventMetadata | string, transactionIdOrPayload?: string | any, amount?: number) {
    if (metadataOrId instanceof CustomerEventMetadata) {
      this.metadata = metadataOrId;
      this.payload = transactionIdOrPayload;
    } else {
      this.payload = { walletId: metadataOrId, transactionId: transactionIdOrPayload, amount: amount! };
      this.metadata = createMetadata(this.eventName, metadataOrId, 'CustomerWallet', 'N/A');
    }
    this.occurredOn = this.metadata.occurredAt;
  }
}

export class WalletDebitedEvent implements CustomerDomainEvent<{ walletId: string; transactionId: string; amount: number }> {
  public readonly eventName = 'WalletDebited';
  public readonly occurredOn: Date;
  public readonly payload: { walletId: string; transactionId: string; amount: number };
  public readonly metadata: CustomerEventMetadata;

  constructor(metadataOrId: CustomerEventMetadata | string, transactionIdOrPayload?: string | any, amount?: number) {
    if (metadataOrId instanceof CustomerEventMetadata) {
      this.metadata = metadataOrId;
      this.payload = transactionIdOrPayload;
    } else {
      this.payload = { walletId: metadataOrId, transactionId: transactionIdOrPayload, amount: amount! };
      this.metadata = createMetadata(this.eventName, metadataOrId, 'CustomerWallet', 'N/A');
    }
    this.occurredOn = this.metadata.occurredAt;
  }
}

export class WalletAdjustedEvent implements CustomerDomainEvent<{ walletId: string; transactionId: string; amount: number }> {
  public readonly eventName = 'WalletAdjusted';
  public readonly occurredOn: Date;
  public readonly payload: { walletId: string; transactionId: string; amount: number };
  public readonly metadata: CustomerEventMetadata;

  constructor(metadataOrId: CustomerEventMetadata | string, transactionIdOrPayload?: string | any, amount?: number) {
    if (metadataOrId instanceof CustomerEventMetadata) {
      this.metadata = metadataOrId;
      this.payload = transactionIdOrPayload;
    } else {
      this.payload = { walletId: metadataOrId, transactionId: transactionIdOrPayload, amount: amount! };
      this.metadata = createMetadata(this.eventName, metadataOrId, 'CustomerWallet', 'N/A');
    }
    this.occurredOn = this.metadata.occurredAt;
  }
}

export class WalletFrozenEvent implements CustomerDomainEvent<{ walletId: string }> {
  public readonly eventName = 'WalletFrozen';
  public readonly occurredOn: Date;
  public readonly payload: { walletId: string };
  public readonly metadata: CustomerEventMetadata;

  constructor(metadataOrId: CustomerEventMetadata | string, payload?: any) {
    if (metadataOrId instanceof CustomerEventMetadata) {
      this.metadata = metadataOrId;
      this.payload = payload;
    } else {
      this.payload = { walletId: metadataOrId };
      this.metadata = createMetadata(this.eventName, metadataOrId, 'CustomerWallet', 'N/A');
    }
    this.occurredOn = this.metadata.occurredAt;
  }
}

export class WalletUnfrozenEvent implements CustomerDomainEvent<{ walletId: string }> {
  public readonly eventName = 'WalletUnfrozen';
  public readonly occurredOn: Date;
  public readonly payload: { walletId: string };
  public readonly metadata: CustomerEventMetadata;

  constructor(metadataOrId: CustomerEventMetadata | string, payload?: any) {
    if (metadataOrId instanceof CustomerEventMetadata) {
      this.metadata = metadataOrId;
      this.payload = payload;
    } else {
      this.payload = { walletId: metadataOrId };
      this.metadata = createMetadata(this.eventName, metadataOrId, 'CustomerWallet', 'N/A');
    }
    this.occurredOn = this.metadata.occurredAt;
  }
}

export class WalletArchivedEvent implements CustomerDomainEvent<{ walletId: string }> {
  public readonly eventName = 'WalletArchived';
  public readonly occurredOn: Date;
  public readonly payload: { walletId: string };
  public readonly metadata: CustomerEventMetadata;

  constructor(metadataOrId: CustomerEventMetadata | string, payload?: any) {
    if (metadataOrId instanceof CustomerEventMetadata) {
      this.metadata = metadataOrId;
      this.payload = payload;
    } else {
      this.payload = { walletId: metadataOrId };
      this.metadata = createMetadata(this.eventName, metadataOrId, 'CustomerWallet', 'N/A');
    }
    this.occurredOn = this.metadata.occurredAt;
  }
}
