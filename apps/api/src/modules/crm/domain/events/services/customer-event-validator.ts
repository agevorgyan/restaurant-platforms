import { CustomerDomainEvent } from '../core/customer-domain-event.interface';

export class CustomerEventValidator {
  static validate(event: CustomerDomainEvent): void {
    if (!event.metadata) {
      throw new Error('Event must contain metadata');
    }
    if (!event.metadata.eventId) {
      throw new Error('Event metadata must have an eventId');
    }
    if (!event.metadata.eventType) {
      throw new Error('Event metadata must have an eventType');
    }
    if (!event.metadata.eventVersion) {
      throw new Error('Event metadata must have an eventVersion');
    }
    if (!event.metadata.aggregateId) {
      throw new Error('Event metadata must have an aggregateId');
    }
    if (!event.payload) {
      throw new Error('Event must contain a payload');
    }
  }
}
