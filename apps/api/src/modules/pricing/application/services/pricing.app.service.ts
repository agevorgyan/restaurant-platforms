import { Injectable, BadRequestException } from '@nestjs/common';
import { PricingEngine } from '../../domain/services/pricing-engine.service';
import { PricingContext } from '../../domain/value-objects/pricing-context.value-object';
import { PricingBreakdown } from '../../domain/value-objects/pricing-breakdown.value-object';
import { Money } from '../../domain/value-objects/money.value-object';
import { CalculatePricingDto } from '../dto/pricing.dto';
import { validateCalculatePricing } from '../validation/pricing.schema';
import { PricingCalculatedEvent } from '../../domain/events/pricing.events';

@Injectable()
export class PricingAppService {
  constructor(private readonly engine: PricingEngine) {}

  public calculate(dto: CalculatePricingDto): PricingBreakdown {
    const errors = validateCalculatePricing(dto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    const currency = dto.currency;

    const items = dto.items.map(i => ({
      id: i.id,
      unitPrice: new Money(i.unitPrice, currency),
      quantity: i.quantity,
      modifiers: (i.modifiers || []).map(m => ({
        id: m.id,
        priceAdjustment: new Money(m.priceAdjustment, currency),
        quantity: m.quantity
      }))
    }));

    const deliveryFee = dto.deliveryFee !== undefined ? new Money(dto.deliveryFee, currency) : Money.zero(currency);
    const tip = dto.tip !== undefined ? new Money(dto.tip, currency) : Money.zero(currency);

    const context = new PricingContext(
      currency,
      items,
      dto.promotions || [],
      dto.taxPolicy || null,
      dto.serviceCharges || [],
      deliveryFee,
      tip
    );

    const breakdown = this.engine.calculate(context);
    new PricingCalculatedEvent(context, breakdown);
    return breakdown;
  }
}
