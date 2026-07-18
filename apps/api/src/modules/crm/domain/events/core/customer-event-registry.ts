import { CustomerDomainEvent } from './customer-domain-event.interface';
import { CustomerEventMetadata } from '../value-objects/customer-event-metadata.value-object';

export type EventConstructor = new (metadata: CustomerEventMetadata, payload: any) => CustomerDomainEvent;

export class CustomerEventRegistry {
  private static readonly registry = new Map<string, EventConstructor>();

  static register(eventType: string, constructor: EventConstructor): void {
    if (this.registry.has(eventType)) {
      throw new Error(`Event type ${eventType} is already registered`);
    }
    this.registry.set(eventType, constructor);
  }

  static getConstructor(eventType: string): EventConstructor {
    const constructor = this.registry.get(eventType);
    if (!constructor) {
      throw new Error(`Event type ${eventType} is not registered in the catalog`);
    }
    return constructor;
  }
}
