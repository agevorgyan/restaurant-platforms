import { IntegrationEvent } from './marketing-event-factory';
import { DomainEvent } from '@saas/core';

export class MarketingIntegrationPolicy {
  /**
   * Ensures that events flagged as Critical Priority always have correlation IDs
   */
  public static validatePriorityRequirements<T extends DomainEvent>(event: IntegrationEvent<T>): void {
    if (event.metadata.priority.value === 100) { // CRITICAL
      if (!event.metadata.correlationId) {
        throw new Error('Critical priority events must include a correlation ID for tracing');
      }
    }
  }
}
