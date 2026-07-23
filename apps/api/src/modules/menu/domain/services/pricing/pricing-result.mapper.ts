import { PricingResponse } from '../../value-objects/pricing-response.value-object';
import { DisplayedPrice } from '../../value-objects/displayed-price.value-object';
import { CurrencyReference } from '../../value-objects/currency-reference.value-object';

export class PricingResultMapper {
  public static mapToResponse(rawResult: any): PricingResponse {
    // Maps a raw external DTO to the Menu PricingResponse Domain Value Object
    return PricingResponse.create({
      displayedPrice: DisplayedPrice.create(rawResult.formattedAmount || '0.00'),
      currency: CurrencyReference.create(rawResult.currency || 'USD'),
      taxIncluded: !!rawResult.taxIncluded,
      priceStatus: rawResult.status || 'AVAILABLE',
      effectiveFrom: new Date(rawResult.effectiveFrom || Date.now())
    });
  }
}