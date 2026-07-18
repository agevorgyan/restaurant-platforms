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

export class CustomerCreatedEvent implements CustomerDomainEvent<{ customerId: string; restaurantId: string }> {
  public readonly eventName = 'CustomerCreated';
  public readonly occurredOn: Date;
  public readonly payload: { customerId: string; restaurantId: string };
  public readonly metadata: CustomerEventMetadata;

  constructor(metadataOrId: CustomerEventMetadata | string, restaurantIdOrPayload?: string | any) {
    if (metadataOrId instanceof CustomerEventMetadata) {
      this.metadata = metadataOrId;
      this.payload = restaurantIdOrPayload;
    } else {
      this.payload = { customerId: metadataOrId, restaurantId: restaurantIdOrPayload };
      this.metadata = createMetadata(this.eventName, metadataOrId, 'Customer', restaurantIdOrPayload);
    }
    this.occurredOn = this.metadata.occurredAt;
  }
}

export class CustomerUpdatedEvent implements CustomerDomainEvent<{ customerId: string; restaurantId: string }> {
  public readonly eventName = 'CustomerUpdated';
  public readonly occurredOn: Date;
  public readonly payload: { customerId: string; restaurantId: string };
  public readonly metadata: CustomerEventMetadata;

  constructor(metadataOrId: CustomerEventMetadata | string, restaurantIdOrPayload?: string | any) {
    if (metadataOrId instanceof CustomerEventMetadata) {
      this.metadata = metadataOrId;
      this.payload = restaurantIdOrPayload;
    } else {
      this.payload = { customerId: metadataOrId, restaurantId: restaurantIdOrPayload };
      this.metadata = createMetadata(this.eventName, metadataOrId, 'Customer', restaurantIdOrPayload);
    }
    this.occurredOn = this.metadata.occurredAt;
  }
}

export class CustomerActivatedEvent implements CustomerDomainEvent<{ customerId: string; restaurantId: string }> {
  public readonly eventName = 'CustomerActivated';
  public readonly occurredOn: Date;
  public readonly payload: { customerId: string; restaurantId: string };
  public readonly metadata: CustomerEventMetadata;

  constructor(metadataOrId: CustomerEventMetadata | string, restaurantIdOrPayload?: string | any) {
    if (metadataOrId instanceof CustomerEventMetadata) {
      this.metadata = metadataOrId;
      this.payload = restaurantIdOrPayload;
    } else {
      this.payload = { customerId: metadataOrId, restaurantId: restaurantIdOrPayload };
      this.metadata = createMetadata(this.eventName, metadataOrId, 'Customer', restaurantIdOrPayload);
    }
    this.occurredOn = this.metadata.occurredAt;
  }
}

export class CustomerDeactivatedEvent implements CustomerDomainEvent<{ customerId: string; restaurantId: string }> {
  public readonly eventName = 'CustomerDeactivated';
  public readonly occurredOn: Date;
  public readonly payload: { customerId: string; restaurantId: string };
  public readonly metadata: CustomerEventMetadata;

  constructor(metadataOrId: CustomerEventMetadata | string, restaurantIdOrPayload?: string | any) {
    if (metadataOrId instanceof CustomerEventMetadata) {
      this.metadata = metadataOrId;
      this.payload = restaurantIdOrPayload;
    } else {
      this.payload = { customerId: metadataOrId, restaurantId: restaurantIdOrPayload };
      this.metadata = createMetadata(this.eventName, metadataOrId, 'Customer', restaurantIdOrPayload);
    }
    this.occurredOn = this.metadata.occurredAt;
  }
}

export class CustomerArchivedEvent implements CustomerDomainEvent<{ customerId: string; restaurantId: string }> {
  public readonly eventName = 'CustomerArchived';
  public readonly occurredOn: Date;
  public readonly payload: { customerId: string; restaurantId: string };
  public readonly metadata: CustomerEventMetadata;

  constructor(metadataOrId: CustomerEventMetadata | string, restaurantIdOrPayload?: string | any) {
    if (metadataOrId instanceof CustomerEventMetadata) {
      this.metadata = metadataOrId;
      this.payload = restaurantIdOrPayload;
    } else {
      this.payload = { customerId: metadataOrId, restaurantId: restaurantIdOrPayload };
      this.metadata = createMetadata(this.eventName, metadataOrId, 'Customer', restaurantIdOrPayload);
    }
    this.occurredOn = this.metadata.occurredAt;
  }
}
