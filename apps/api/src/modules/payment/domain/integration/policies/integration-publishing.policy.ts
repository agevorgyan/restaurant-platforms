import { DomainEvent } from '@saas/core';

export class IntegrationPublishingPolicy {
  public shouldPublish(domainEvent: DomainEvent): boolean {
    // Only events that have an aggregate ID should be published outward
    if (!domainEvent.getAggregateId || typeof domainEvent.getAggregateId !== 'function') {
      return false;
    }

    const aggregateId = domainEvent.getAggregateId();
    if (!aggregateId || aggregateId.trim() === '') {
      return false;
    }

    return true;
  }
}
