import { Entity } from '@saas/core';
import { Money } from '../../../finance/domain/value-objects/money.value-object';

export interface QuotationLineItemProps {
  productId: string;
  quantity: number;
  basePrice: Money;
  totalBasePrice: Money; // quantity * basePrice
}

export class QuotationLineItem extends Entity<QuotationLineItemProps> {
  private constructor(id: string, props: QuotationLineItemProps) {
    super(id, props);
  }

  public static create(id: string, props: QuotationLineItemProps): QuotationLineItem {
    if (props.quantity <= 0) {
      throw new Error('Quotation line item quantity must be greater than zero');
    }
    return new QuotationLineItem(id, props);
  }

  get productId(): string { return this.props.productId; }
  get quantity(): number { return this.props.quantity; }
  get basePrice(): Money { return this.props.basePrice; }
  get totalBasePrice(): Money { return this.props.totalBasePrice; }
}
