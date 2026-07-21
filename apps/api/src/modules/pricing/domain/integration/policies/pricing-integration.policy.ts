import { IntegrationEventPayload } from '../services/pricing-event.mapper';
import { PricingEventCompatibilitySpecification } from '../specifications/pricing-event-compatibility.specification';
import { PricingEventOrderingSpecification } from '../specifications/pricing-event-ordering.specification';

export class PricingIntegrationPolicy {
  constructor(
    private readonly compatibilitySpec: PricingEventCompatibilitySpecification,
    private readonly orderingSpec: PricingEventOrderingSpecification
  ) {}

  public canIntegrate(
    newEvent: IntegrationEventPayload, 
    lastEvent: IntegrationEventPayload | null,
    minVersion: number = 1
  ): boolean {
    if (!this.compatibilitySpec.isSatisfiedBy(newEvent, minVersion)) {
      throw new Error(`Event ${newEvent.eventName} failed compatibility checks. Minimum supported version is ${minVersion}.`);
    }

    if (!this.orderingSpec.isSatisfiedBy(newEvent, lastEvent)) {
      throw new Error(`Event ${newEvent.eventName} failed chronological ordering checks.`);
    }

    return true;
  }
}
