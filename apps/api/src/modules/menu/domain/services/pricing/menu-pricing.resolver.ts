import { PricingRequest } from '../../value-objects/pricing-request.value-object';
import { PricingResponse } from '../../value-objects/pricing-response.value-object';
import { PriceReferenceValidator } from './price-reference.validator';
import { MenuPricingPolicyEngine } from './menu-pricing-policy.engine';
import { PricingResultMapper } from './pricing-result.mapper';

export class MenuPricingResolver {
  public resolve(request: PricingRequest, externalFetchFn: (req: PricingRequest) => any): PricingResponse {
    // 1. Validate
    PriceReferenceValidator.validate(request);
    MenuPricingPolicyEngine.validate(request);

    // 2. Fetch (injected dependency simulating Gateway call)
    const rawData = externalFetchFn(request);

    // 3. Map
    return PricingResultMapper.mapToResponse(rawData);
  }
}