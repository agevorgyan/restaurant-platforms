import { PricingRequest } from '../../value-objects/pricing-request.value-object';
import { PricingReferenceSpecification } from '../../specifications/pricing.specifications';

export class PriceReferenceValidator {
  public static validate(request: PricingRequest): void {
    if (!PricingReferenceSpecification.isSatisfiedBy(request)) {
      throw new Error('Invalid PriceReference');
    }
  }
}