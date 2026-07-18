import { CustomerEventMetadata } from '../value-objects/customer-event-metadata.value-object';
import { CustomerEventVersion } from '../value-objects/customer-event-version.value-object';
import { CustomerDomainEvent } from '../core/customer-domain-event.interface';
import { CustomerEventRegistry } from '../core/customer-event-registry';
import { CustomerEventType } from '../core/customer-event-catalog';

export class CustomerEventFactory {
  static create<TPayload>(
    eventType: CustomerEventType,
    aggregateId: string,
    aggregateType: string,
    restaurantId: string,
    payload: TPayload,
    options?: {
      correlationId?: string;
      causationId?: string;
      initiatedBy?: string;
    }
  ): CustomerDomainEvent<TPayload> {
    const eventId = Math.random().toString(36).substring(2, 15); // Simple ID generation
    const version = new CustomerEventVersion('1.0.0');
    
    const metadata = new CustomerEventMetadata(
      eventId,
      eventType,
      version,
      aggregateId,
      aggregateType,
      restaurantId,
      new Date(),
      options?.correlationId,
      options?.causationId,
      options?.initiatedBy
    );

    const EventClass = CustomerEventRegistry.getConstructor(eventType);
    return new EventClass(metadata, payload);
  }
}
