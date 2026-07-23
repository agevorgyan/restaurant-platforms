import { MenuPricingGateway } from '../services/pricing/menu-pricing.gateway';
import { PricingRequest } from '../value-objects/pricing-request.value-object';
import { PriceReference } from '../value-objects/price-reference.value-object';
import { CurrencyReference } from '../value-objects/currency-reference.value-object';

describe('MenuPricingIntegration', () => {
  it('should fetch pricing successfully via gateway', () => {
    const gateway = new MenuPricingGateway();
    
    const request = PricingRequest.create({
      priceRef: PriceReference.create('price-123'),
      branchReference: 'branch-1',
      salesChannel: 'POS',
      currency: CurrencyReference.create('USD'),
      evaluationDateTime: new Date()
    });

    const mockFetch = (req: PricingRequest) => ({
      formattedAmount: '15.99 USD',
      currency: req.currency.code,
      taxIncluded: true,
      status: 'AVAILABLE'
    });

    const { response, events } = gateway.fetchPricing(request, mockFetch);

    expect(response).toBeDefined();
    expect(response?.displayedPrice.formattedValue).toBe('15.99 USD');
    expect(events.length).toBe(2);
    expect(events[1].constructor.name).toBe('PricingResolvedEvent');
  });

  it('should validate supported currency', () => {
    expect(() => CurrencyReference.create('')).toThrow();
  });
});