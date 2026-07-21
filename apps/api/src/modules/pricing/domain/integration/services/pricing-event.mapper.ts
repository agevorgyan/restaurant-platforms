import { DomainEvent } from '@saas/core';

// Represents the external-facing DTO mapping for Integration Events
export interface IntegrationEventPayload {
  eventName: string;
  aggregateId: string;
  metadata: any;
  data: any;
}

export class PricingEventMapper {
  public static mapToIntegrationEvent(
    event: DomainEvent, 
    metadata: any
  ): IntegrationEventPayload {
    const eventName = event.constructor.name;
    const aggregateId = event.getAggregateId();

    return {
      eventName,
      aggregateId,
      metadata,
      // Spread all custom properties of the event as the data payload
      data: { ...event }
    };
  }
}
