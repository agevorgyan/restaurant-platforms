import { DomainEvent } from '@saas/core';
import { InventoryIntegrationEventPayload } from './inventory-integration-event';
import { InventoryEventRegistry } from './inventory-event-registry';
import { InventoryEventFactory } from './inventory-event-factory';
import { InventoryIntegrationContext } from '../value-objects/inventory-integration-context.value-object';

export class InventoryIntegrationMapper {
  constructor(private readonly registry: InventoryEventRegistry) {}

  public mapToIntegrationEvents<T extends DomainEvent>(
    domainEvent: T,
    context: InventoryIntegrationContext
  ): InventoryIntegrationEventPayload[] {
    const eventName = domainEvent.constructor.name;
    const targetEventNames = this.registry.getOutboundEventsFor(eventName);

    return targetEventNames.map(targetName => 
      InventoryEventFactory.createIntegrationEvent(domainEvent, targetName, context)
    );
  }

  public mapToDomainAction(integrationEvent: InventoryIntegrationEventPayload): { action: string, data: any } {
    const action = this.registry.getInboundActionFor(integrationEvent.metadata.eventName);
    if (!action) {
      throw new Error(`No domain action mapped for inbound event: ${integrationEvent.metadata.eventName}`);
    }

    return {
      action,
      data: integrationEvent.data
    };
  }
}
