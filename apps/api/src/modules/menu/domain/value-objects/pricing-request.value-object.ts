import { ValueObject } from '@saas/core';
import { PriceReference } from './price-reference.value-object';
import { CurrencyReference } from './currency-reference.value-object';
import { MenuItemReference } from './menu-item-reference.value-object';
import { ModifierGroupReference } from './modifier-group-reference.value-object';

export interface PricingRequestProps {
  menuItemRef?: MenuItemReference;
  modifierGroupRef?: ModifierGroupReference;
  priceRef: PriceReference;
  branchReference: string;
  salesChannel: string;
  currency: CurrencyReference;
  customerSegmentReference?: string;
  evaluationDateTime: Date;
}

export class PricingRequest extends ValueObject<PricingRequestProps> {
  get priceRef(): PriceReference { return this.props.priceRef; }
  get branchReference(): string { return this.props.branchReference; }
  get salesChannel(): string { return this.props.salesChannel; }
  get currency(): CurrencyReference { return this.props.currency; }
  get evaluationDateTime(): Date { return this.props.evaluationDateTime; }

  private constructor(props: PricingRequestProps) { super(props); }
  public static create(props: PricingRequestProps): PricingRequest {
    if (!props.priceRef) throw new Error('Price reference is required');
    return new PricingRequest(props);
  }
}