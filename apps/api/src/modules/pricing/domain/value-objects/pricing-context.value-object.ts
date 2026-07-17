import { Money } from './money.value-object';

export interface IPricingContextItemModifier {
  id: string;
  priceAdjustment: Money;
  quantity: number;
}

export interface IPricingContextItem {
  id: string;
  unitPrice: Money;
  quantity: number;
  modifiers: IPricingContextItemModifier[];
}

export interface IPricingContextPromotion {
  id: string;
  type: 'Percentage' | 'FixedAmount';
  value: number; // percentage (0-100) or minor units
}

export interface IPricingContextTaxRule {
  name: string;
  percentage: number;
}

export interface IPricingContextTaxPolicy {
  calculationMode: 'Inclusive' | 'Exclusive' | 'Compound';
  rules: IPricingContextTaxRule[];
}

export interface IPricingContextServiceCharge {
  name: string;
  type: 'Percentage' | 'Fixed';
  value: number; // percentage or minor units
}

export class PricingContext {
  constructor(
    public readonly currency: string,
    public readonly items: IPricingContextItem[],
    public readonly promotions: IPricingContextPromotion[] = [],
    public readonly taxPolicy: IPricingContextTaxPolicy | null = null,
    public readonly serviceCharges: IPricingContextServiceCharge[] = [],
    public readonly deliveryFee: Money | null = null,
    public readonly tip: Money | null = null
  ) {}
}
