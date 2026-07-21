import { DomainEvent } from '@saas/core';
import { PaymentEventRegistry } from './payment-event-registry.service';
import { PaymentEventFactory, PaymentIntegrationEvent } from './payment-event-factory.service';
import { PaymentIntegrationContext } from '../value-objects/payment-integration-context.value-object';
import { IntegrationPublishingPolicy } from '../policies/integration-publishing.policy';

export type PaymentPayloadMapper = (event: DomainEvent) => any;

export class PaymentIntegrationMapper {
  private readonly mappers = new Map<string, PaymentPayloadMapper>();

  constructor(
    private readonly registry: PaymentEventRegistry,
    private readonly factory: PaymentEventFactory,
    private readonly publishingPolicy: IntegrationPublishingPolicy
  ) {}

  public registerMapper(integrationEventName: string, mapper: PaymentPayloadMapper): void {
    if (this.mappers.has(integrationEventName)) {
      throw new Error(`Mapper for ${integrationEventName} already registered`);
    }
    this.mappers.set(integrationEventName, mapper);
  }

  public mapDomainEvent(
    domainEvent: DomainEvent, 
    contextFactory: (integrationEventName: string) => PaymentIntegrationContext
  ): PaymentIntegrationEvent[] {
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
