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

export class CustomerSegmentCreatedEvent implements CustomerDomainEvent<{ segmentId: string; restaurantId: string }> {
  public readonly eventName = 'CustomerSegmentCreated';
  public readonly occurredOn: Date;
  public readonly payload: { segmentId: string; restaurantId: string };
  public readonly metadata: CustomerEventMetadata;

  constructor(metadataOrId: CustomerEventMetadata | string, restaurantIdOrPayload?: string | any) {
    if (metadataOrId instanceof CustomerEventMetadata) {
      this.metadata = metadataOrId;
      this.payload = restaurantIdOrPayload;
    } else {
      this.payload = { segmentId: metadataOrId, restaurantId: restaurantIdOrPayload };
      this.metadata = createMetadata(this.eventName, metadataOrId, 'CustomerSegment', restaurantIdOrPayload);
    }
    this.occurredOn = this.metadata.occurredAt;
  }
}

export class CustomerSegmentUpdatedEvent implements CustomerDomainEvent<{ segmentId: string; restaurantId: string }> {
  public readonly eventName = 'CustomerSegmentUpdated';
  public readonly occurredOn: Date;
  public readonly payload: { segmentId: string; restaurantId: string };
  public readonly metadata: CustomerEventMetadata;

  constructor(metadataOrId: CustomerEventMetadata | string, restaurantIdOrPayload?: string | any) {
    if (metadataOrId instanceof CustomerEventMetadata) {
      this.metadata = metadataOrId;
      this.payload = restaurantIdOrPayload;
    } else {
      this.payload = { segmentId: metadataOrId, restaurantId: restaurantIdOrPayload };
      this.metadata = createMetadata(this.eventName, metadataOrId, 'CustomerSegment', restaurantIdOrPayload);
    }
    this.occurredOn = this.metadata.occurredAt;
  }
}

export class CustomerSegmentActivatedEvent implements CustomerDomainEvent<{ segmentId: string; restaurantId: string }> {
  public readonly eventName = 'CustomerSegmentActivated';
  public readonly occurredOn: Date;
  public readonly payload: { segmentId: string; restaurantId: string };
  public readonly metadata: CustomerEventMetadata;

  constructor(metadataOrId: CustomerEventMetadata | string, restaurantIdOrPayload?: string | any) {
    if (metadataOrId instanceof CustomerEventMetadata) {
      this.metadata = metadataOrId;
      this.payload = restaurantIdOrPayload;
    } else {
      this.payload = { segmentId: metadataOrId, restaurantId: restaurantIdOrPayload };
      this.metadata = createMetadata(this.eventName, metadataOrId, 'CustomerSegment', restaurantIdOrPayload);
    }
    this.occurredOn = this.metadata.occurredAt;
  }
}

export class CustomerSegmentArchivedEvent implements CustomerDomainEvent<{ segmentId: string; restaurantId: string }> {
  public readonly eventName = 'CustomerSegmentArchived';
  public readonly occurredOn: Date;
  public readonly payload: { segmentId: string; restaurantId: string };
  public readonly metadata: CustomerEventMetadata;

  constructor(metadataOrId: CustomerEventMetadata | string, restaurantIdOrPayload?: string | any) {
    if (metadataOrId instanceof CustomerEventMetadata) {
      this.metadata = metadataOrId;
      this.payload = restaurantIdOrPayload;
    } else {
      this.payload = { segmentId: metadataOrId, restaurantId: restaurantIdOrPayload };
      this.metadata = createMetadata(this.eventName, metadataOrId, 'CustomerSegment', restaurantIdOrPayload);
    }
    this.occurredOn = this.metadata.occurredAt;
  }
}
