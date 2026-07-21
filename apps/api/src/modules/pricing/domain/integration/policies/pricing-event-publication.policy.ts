import { IntegrationEventPayload } from '../services/pricing-event.mapper';

export class PricingEventPublicationPolicy {
  public canPublish(event: IntegrationEventPayload): boolean {
    // Requires standard metadata wrapper to safely egress across Bounded Context boundaries
    if (!event.eventName || !event.aggregateId) {
      throw new Error('Event is missing core identifying data (name, aggregateId)');
    }

    if (!event.metadata || !event.metadata.correlationId) {
      throw new Error('Event is missing required cross-context correlation ID');
    }

    if (!event.data) {
      throw new Error('Event payload data cannot be empty');
    }

    return true;
  }
}
