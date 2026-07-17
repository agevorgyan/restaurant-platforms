import { PricingBreakdown } from '../value-objects/pricing-breakdown.value-object';
import { PricingContext } from '../value-objects/pricing-context.value-object';

export class PricingCalculatedEvent {
  constructor(
    public readonly context: PricingContext,
    public readonly breakdown: PricingBreakdown
  ) {}
}
