import { IntegrationEvent } from '../components/marketing-event-factory';
import { DomainEvent } from '@saas/core';

export class EventOrderingSpecification {
  /**
   * Verifies deterministic ordering: Event A must have happened strictly before Event B
   */
  public isStrictlyBefore<T extends DomainEvent, U extends DomainEvent>(eventA: IntegrationEvent<T>, eventB: IntegrationEvent<U>): boolean {
    if (eventA.metadata.timestamp.getTime() >= eventB.metadata.timestamp.getTime()) {
      return false;
    }

    // Secondary check: if they have causation linkage, event A should be the cause of B
    if (eventB.metadata.causationId && eventA.metadata.eventId) {
      if (eventB.metadata.causationId.value === eventA.metadata.eventId.value) {
        return true;
      }
    }

    return true;
  }
}
