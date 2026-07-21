import { PricingContext } from '../value-objects/pricing-context.value-object';

export class PricingContextSpecification {
  public isSatisfiedBy(context: PricingContext): boolean {
    if (!context.restaurantId || context.restaurantId.trim().length === 0) {
      return false;
    }
    if (!context.currencyCode) {
      return false;
    }
    if (!context.calculationDate) {
      return false;
    }
    return true;
  }
}
