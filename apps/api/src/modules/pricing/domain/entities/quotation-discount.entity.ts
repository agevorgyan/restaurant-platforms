import { Entity } from '@saas/core';
import { Money } from '../../../finance/domain/value-objects/money.value-object';

export interface QuotationDiscountProps {
  discountRuleId: string;
  campaignId?: string;
  couponId?: string;
  description: string;
  amount: Money;
}

export class QuotationDiscount extends Entity<QuotationDiscountProps> {
  private constructor(id: string, props: QuotationDiscountProps) {
    super(id, props);
  }

  public static create(id: string, props: QuotationDiscountProps): QuotationDiscount {
    return new QuotationDiscount(id, props);
  }

  get discountRuleId(): string { return this.props.discountRuleId; }
  get campaignId(): string | undefined { return this.props.campaignId; }
  get couponId(): string | undefined { return this.props.couponId; }
  get description(): string { return this.props.description; }
  get amount(): Money { return this.props.amount; }
}
