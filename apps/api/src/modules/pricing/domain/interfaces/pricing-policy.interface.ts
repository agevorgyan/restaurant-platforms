import { PricingContext } from '../value-objects/pricing-context.value-object';
import { PricingBreakdown } from '../value-objects/pricing-breakdown.value-object';

export interface IPricingPolicy {
  calculate(context: PricingContext): PricingBreakdown;
}
