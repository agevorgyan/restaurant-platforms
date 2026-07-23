import { ValueObject } from '@saas/core';
import { DisplayedPrice } from './displayed-price.value-object';
import { CurrencyReference } from './currency-reference.value-object';

export interface PricingResponseProps {
  displayedPrice: DisplayedPrice;
  currency: CurrencyReference;
  taxIncluded: boolean;
  priceStatus: string;
  effectiveFrom: Date;
  effectiveUntil?: Date;
}

export class PricingResponse extends ValueObject<PricingResponseProps> {
  get displayedPrice(): DisplayedPrice { return this.props.displayedPrice; }
  get currency(): CurrencyReference { return this.props.currency; }
  get taxIncluded(): boolean { return this.props.taxIncluded; }
  get priceStatus(): string { return this.props.priceStatus; }
  get effectiveFrom(): Date { return this.props.effectiveFrom; }

  private constructor(props: PricingResponseProps) { super(props); }
  public static create(props: PricingResponseProps): PricingResponse {
    return new PricingResponse(props);
  }
}