import { DomainEvent } from '@saas/core';
import { InventoryIntegrationEventPayload } from './inventory-integration-event';
import { InventoryIntegrationContext } from '../value-objects/inventory-integration-context.value-object';

export class InventoryEventFactory {
  public static createIntegrationEvent<T extends DomainEvent>(
    domainEvent: T,
    eventName: string,
    context: InventoryIntegrationContext
  ): InventoryIntegrationEventPayload<T> {
    return {
      metadata: {
        eventId: crypto.randomUUID(),
        correlationId: context.correlationId.value,
        causationId: context.causationId?.value,
        timestamp: context.timestamp.toISOString(),
        version: context.version.versionString,
        priority: context.priority.level,
        source: context.source,
        eventName
      },
      data: domainEvent
    };
  }
}
