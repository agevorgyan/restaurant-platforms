import { CalculatePricingDto } from '../dto/pricing.dto';

export const validateCalculatePricing = (dto: CalculatePricingDto): string[] => {
  const errors: string[] = [];
  
  if (!dto.currency) errors.push('currency is required');
  if (!dto.items || dto.items.length === 0) errors.push('At least one item is required for pricing calculation');
  
  // Integer minor units check
  if (dto.items) {
    for (const item of dto.items) {
      if (!Number.isInteger(item.unitPrice)) errors.push(`Item ${item.id} unitPrice must be an integer (minor units)`);
      if (item.modifiers) {
        for (const mod of item.modifiers) {
          if (!Number.isInteger(mod.priceAdjustment)) errors.push(`Modifier ${mod.id} priceAdjustment must be an integer`);
        }
      }
    }
  }

  if (dto.promotions) {
    for (const promo of dto.promotions) {
      if (promo.type === 'FixedAmount' && !Number.isInteger(promo.value)) {
        errors.push(`Promotion ${promo.id} fixed amount must be an integer`);
      }
    }
  }

  if (dto.deliveryFee !== undefined && !Number.isInteger(dto.deliveryFee)) {
    errors.push('deliveryFee must be an integer');
  }

  if (dto.tip !== undefined && !Number.isInteger(dto.tip)) {
    errors.push('tip must be an integer');
  }
  
  return errors;
};
