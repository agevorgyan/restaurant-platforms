import { PricingRequest } from '../../value-objects/pricing-request.value-object';
import { PricingResponse } from '../../value-objects/pricing-response.value-object';
import { MenuPricingResolver } from './menu-pricing.resolver';
import { PricingRequestedEvent, PricingResolvedEvent, PricingUnavailableEvent } from '../../events/pricing.events';
import { PricingCorrelationId } from '../../value-objects/pricing-correlation-id.value-object';

export class MenuPricingGateway {
  private resolver: MenuPricingResolver;

  constructor() {
    this.resolver = new MenuPricingResolver();
  }

  public fetchPricing(request: PricingRequest, fetchProvider: (req: PricingRequest) => any): { response: PricingResponse | null, events: any[] } {
    const correlationId = PricingCorrelationId.create().value;
    const events: any[] = [];
    events.push(new PricingRequestedEvent(correlationId, request.priceRef.priceId));

    try {
      const response = this.resolver.resolve(request, fetchProvider);
      events.push(new PricingResolvedEvent(correlationId, response.displayedPrice.formattedValue));
      return { response, events };
    } catch (e: any) {
      events.push(new PricingUnavailableEvent(correlationId, e.message));
      return { response: null, events };
    }
  }
}