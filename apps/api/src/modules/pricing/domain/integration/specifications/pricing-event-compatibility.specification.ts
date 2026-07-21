import { IntegrationEventPayload } from '../services/pricing-event.mapper';
import { PricingEventVersion } from '../value-objects/pricing-event-version.value-object';

export class PricingEventCompatibilitySpecification {
  // Simulates compatibility checks across different version schemas
  public isSatisfiedBy(event: IntegrationEventPayload, minimumSupportedVersion: number): boolean {
    if (!event.metadata || typeof event.metadata.version !== 'number') {
      return false;
    }

    const eventVersion = PricingEventVersion.create(event.metadata.version);
    return eventVersion.value >= minimumSupportedVersion;
  }
}
