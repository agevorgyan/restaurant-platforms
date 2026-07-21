import { DomainEvent } from '@saas/core';
import { PricingEventMetadata } from '../value-objects/pricing-event-metadata.value-object';
import { PricingEventMapper, IntegrationEventPayload } from './pricing-event.mapper';

export class PricingEventFactory {
  public static createIntegrationEvent(
    domainEvent: DomainEvent,
    metadata: PricingEventMetadata
  ): IntegrationEventPayload {
    // Map Domain Event to Integration Event
    const mappedMetadata = {
      eventId: metadata.eventId.value,
      correlationId: metadata.correlationId.value,
      causationId: metadata.causationId?.value,
      source: metadata.source.value,
      version: metadata.version.value,
      priority: metadata.priority.value,
      timestamp: metadata.timestamp.toISOString()
    };

    return PricingEventMapper.mapToIntegrationEvent(domainEvent, mappedMetadata);
  }
}
