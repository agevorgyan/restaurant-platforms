import { Entity } from '@saas/core';
import { Money } from '../../../finance/domain/value-objects/money.value-object';

export interface PricingLineItemProps {
  productId: string;
  quantity: number;
  basePrice: Money;
  totalBasePrice: Money; // quantity * basePrice
}

export class PricingLineItem extends Entity<PricingLineItemProps> {
  private constructor(id: string, props: PricingLineItemProps) {
    super(id, props);
  }

  public static create(id: string, props: PricingLineItemProps): PricingLineItem {
    if (props.quantity <= 0) {
      throw new Error('Line item quantity must be greater than zero');
    }
    if (props.basePrice.currency.code !== props.totalBasePrice.currency.code) {
      throw new Error('Currency mismatch between base price and total base price');
    }
    return new PricingLineItem(id, props);
  }

  get productId(): string { return this.props.productId; }
  get quantity(): number { return this.props.quantity; }
  get basePrice(): Money { return this.props.basePrice; }
  get totalBasePrice(): Money { return this.props.totalBasePrice; }
}
