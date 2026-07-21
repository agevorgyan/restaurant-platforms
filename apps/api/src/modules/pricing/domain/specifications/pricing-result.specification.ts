import { PricingResult } from '../value-objects/pricing-result.value-object';

export class PricingResultSpecification {
  public isSatisfiedBy(result: PricingResult): boolean {
    if (!result.baseTotal || !result.grandTotal) {
      return false;
    }

    if (result.baseTotal.amount.value < 0) {
      return false;
    }

    if (result.grandTotal.amount.value < 0) {
      return false; // Grand total cannot be negative in this domain model
    }

    return true;
  }
}
