import { PricingRequest } from '../value-objects/pricing-request.value-object';
import { PricingResponse } from '../value-objects/pricing-response.value-object';

export class PricingReferenceSpecification {
  public static isSatisfiedBy(request: PricingRequest): boolean {
    return !!request.priceRef;
  }
}

export class PricingAvailabilitySpecification {
  public static isSatisfiedBy(response: PricingResponse): boolean {
    return response.priceStatus === 'AVAILABLE';
  }
}

export class CurrencySpecification {
  public static isSatisfiedBy(request: PricingRequest): boolean {
    return !!request.currency && request.currency.code.length === 3;
  }
}

export class DisplayedPriceSpecification {
  public static isSatisfiedBy(response: PricingResponse): boolean {
    return !!response.displayedPrice && response.displayedPrice.formattedValue.length > 0;
  }
}

export class PricingContractSpecification {
  public static isSatisfiedBy(request: PricingRequest): boolean {
    return !!request.branchReference && !!request.salesChannel;
  }
}