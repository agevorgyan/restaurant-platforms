import { PricingRequest } from '../../value-objects/pricing-request.value-object';
import { PricingIntegrationPolicy, CurrencyPolicy } from '../../policies/pricing.policies';
import { PricingContractSpecification } from '../../specifications/pricing.specifications';

export class MenuPricingPolicyEngine {
  public static validate(request: PricingRequest): void {
    PricingIntegrationPolicy.validateRequest(request);
    
    if (!CurrencyPolicy.isSupported(request.currency.code)) {
      throw new Error('Unsupported Currency');
    }

    if (!PricingContractSpecification.isSatisfiedBy(request)) {
      throw new Error('Pricing Contract Specification failed');
    }
  }
}