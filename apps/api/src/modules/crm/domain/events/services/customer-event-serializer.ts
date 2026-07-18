import { CustomerDomainEvent } from '../core/customer-domain-event.interface';
import { CustomerEventRegistry } from '../core/customer-event-registry';
import { CustomerEventMetadata } from '../value-objects/customer-event-metadata.value-object';
import { CustomerEventVersion } from '../value-objects/customer-event-version.value-object';
import { CustomerEventValidator } from './customer-event-validator';

export class CustomerEventSerializer {
  static serialize(event: CustomerDomainEvent): string {
    CustomerEventValidator.validate(event);
    return JSON.stringify({
      metadata: {
        eventId: event.metadata.eventId,
        eventType: event.metadata.eventType,
        eventVersion: event.metadata.eventVersion.value,
        aggregateId: event.metadata.aggregateId,
        aggregateType: event.metadata.aggregateType,
        restaurantId: event.metadata.restaurantId,
        occurredAt: event.metadata.occurredAt.toISOString(),
        correlationId: event.metadata.correlationId,
        causationId: event.metadata.causationId,
        initiatedBy: event.metadata.initiatedBy
      },
      payload: event.payload
    });
  }

  static deserialize(json: string): CustomerDomainEvent {
    const raw = JSON.parse(json);
    
    if (!raw.metadata || !raw.metadata.eventType) {
      throw new Error('Invalid serialized event payload');
    }

    const version = new CustomerEventVersion(raw.metadata.eventVersion);
    const metadata = new CustomerEventMetadata(
      raw.metadata.eventId,
      raw.metadata.eventType,
      version,
      raw.metadata.aggregateId,
      raw.metadata.aggregateType,
      raw.metadata.restaurantId,
      new Date(raw.metadata.occurredAt),
      raw.metadata.correlationId,
      raw.metadata.causationId,
      raw.metadata.initiatedBy
    );

    const EventClass = CustomerEventRegistry.getConstructor(metadata.eventType);
    const event = new EventClass(metadata, raw.payload);
    
    CustomerEventValidator.validate(event);
    return event;
  }
}
