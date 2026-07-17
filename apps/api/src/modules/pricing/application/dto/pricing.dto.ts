export class PricingItemModifierDto {
  id: string;
  priceAdjustment: number; // minor units
  quantity: number;
}

export class PricingItemDto {
  id: string;
  unitPrice: number; // minor units
  quantity: number;
  modifiers?: PricingItemModifierDto[];
}

export class PricingPromotionDto {
  id: string;
  type: 'Percentage' | 'FixedAmount';
  value: number; // percentage or minor units
}

export class PricingTaxRuleDto {
  name: string;
  percentage: number;
}

export class PricingTaxPolicyDto {
  calculationMode: 'Inclusive' | 'Exclusive' | 'Compound';
  rules: PricingTaxRuleDto[];
}

export class PricingServiceChargeDto {
  name: string;
  type: 'Percentage' | 'Fixed';
  value: number;
}

export class CalculatePricingDto {
  currency: string;
  items: PricingItemDto[];
  promotions?: PricingPromotionDto[];
  taxPolicy?: PricingTaxPolicyDto;
  serviceCharges?: PricingServiceChargeDto[];
  deliveryFee?: number; // minor units
  tip?: number; // minor units
}
