import { IntegrationEvent } from '../components/marketing-event-factory';
import { DomainEvent } from '@saas/core';

export class EventCompatibilitySpecification {
  /**
   * Verifies if an incoming or outgoing event structurally complies with the registered contract expectations
   */
  public isSatisfiedBy<T extends DomainEvent>(event: IntegrationEvent<T>): boolean {
    if (!event.metadata || !event.payload) {
      return false;
    }

    if (!event.metadata.eventId || !event.metadata.version || !event.metadata.source) {
      return false;
    }

    if (!event.metadata.timestamp) {
      return false;
    }

    // A valid event payload must have at least an aggregate id method / property
    if (typeof event.payload.getAggregateId !== 'function') {
      return false;
    }

    return true;
  }
}
