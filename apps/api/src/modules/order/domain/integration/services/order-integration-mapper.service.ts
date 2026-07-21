import { DomainEvent } from '@saas/core';
import { OrderEventRegistry } from './order-event-registry.service';
import { OrderEventFactory, IntegrationEvent } from './order-event-factory.service';
import { OrderIntegrationContext } from '../value-objects/order-integration-context.value-object';
import { IntegrationPublishingPolicy } from '../policies/integration-publishing.policy';

export type PayloadMapper = (event: DomainEvent) => any;

export class OrderIntegrationMapper {
  private readonly mappers = new Map<string, PayloadMapper>();

  constructor(
    private readonly registry: OrderEventRegistry,
    private readonly factory: OrderEventFactory,
    private readonly publishingPolicy: IntegrationPublishingPolicy
  ) {}

  public registerMapper(integrationEventName: string, mapper: PayloadMapper): void {
    if (this.mappers.has(integrationEventName)) {
      throw new Error(`Mapper for ${integrationEventName} already registered`);
    }
    this.mappers.set(integrationEventName, mapper);
  }

  public mapDomainEvent(
    domainEvent: DomainEvent, 
    contextFactory: (integrationEventName: string) => OrderIntegrationContext
  ): IntegrationEvent[] {
    if (!this.publishingPolicy.shouldPublish(domainEvent)) {
      return [];
    }

    const domainEventName = domainEvent.constructor.name;
    const targetEvents = this.registry.getIntegrationEventsFor(domainEventName);

    return targetEvents.map(integrationEventName => {
      const mapper = this.mappers.get(integrationEventName);
      if (!mapper) {
        throw new Error(`No payload mapper registered for integration event: ${integrationEventName}`);
      }

      const payload = mapper(domainEvent);
      const context = contextFactory(integrationEventName);
      
      return this.factory.create(integrationEventName, context, payload);
    });
  }
}
