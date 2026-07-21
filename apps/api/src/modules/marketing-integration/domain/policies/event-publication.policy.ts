import { IntegrationEvent } from '../components/marketing-event-factory';
import { DomainEvent } from '@saas/core';
import { EventCompatibilitySpecification } from '../specifications/event-compatibility.specification';
import { MarketingIntegrationPolicy } from '../components/marketing-integration-policy';

export class EventPublicationPolicy {
  private compatibilitySpec = new EventCompatibilitySpecification();

  public canPublish<T extends DomainEvent>(event: IntegrationEvent<T>): boolean {
    if (!this.compatibilitySpec.isSatisfiedBy(event)) {
      throw new Error('Event does not meet compatibility specifications for publication');
    }

    MarketingIntegrationPolicy.validatePriorityRequirements(event);

    return true;
  }
}
