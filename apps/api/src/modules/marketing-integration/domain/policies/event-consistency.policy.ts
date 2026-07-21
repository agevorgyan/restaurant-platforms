import { IntegrationEvent } from '../components/marketing-event-factory';
import { DomainEvent } from '@saas/core';

export class EventConsistencyPolicy {
  /**
   * Ensures that a batch of events related to the same correlation boundary
   * share exactly the same Correlation ID.
   */
  public static ensureCorrelationConsistency<T extends DomainEvent>(events: IntegrationEvent<T>[], expectedCorrelationId: string): void {
    const inconsistent = events.find(e => !e.metadata.correlationId || e.metadata.correlationId.value !== expectedCorrelationId);
    
    if (inconsistent) {
      throw new Error(`Event consistency policy violated: Event ${inconsistent.metadata.eventId.value} does not match expected correlation ID ${expectedCorrelationId}`);
    }
  }
}
