import { DomainEvent } from '@saas/core';

export class IntegrationPublishingPolicy {
  public shouldPublish(event: DomainEvent): boolean {
    // Only certain domain events map to integration events.
    // For now, we assume if it hits the mapper and there is a mapping, it should be published.
    // In advanced setups, we might look at flags in the event to prevent external publishing.
    return !!event;
  }
}
