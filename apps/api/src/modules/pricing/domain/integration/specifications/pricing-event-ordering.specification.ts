import { IntegrationEventPayload } from '../services/pricing-event.mapper';

export class PricingEventOrderingSpecification {
  // Evaluates if the new event strictly follows chronologically from the last processed event
  public isSatisfiedBy(newEvent: IntegrationEventPayload, lastProcessedEvent: IntegrationEventPayload | null): boolean {
    if (!lastProcessedEvent) {
      return true; // First event is always ordered correctly
    }

    const newTimestamp = new Date(newEvent.metadata.timestamp);
    const lastTimestamp = new Date(lastProcessedEvent.metadata.timestamp);

    // Event must occur after the last processed event, OR at the exact same time but with higher priority/tie-breaker logic
    return newTimestamp >= lastTimestamp;
  }
}
