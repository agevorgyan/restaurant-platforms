import { Entity } from '@saas/core';
import { DiscountAmount } from '../value-objects/discount-amount.value-object';
import { DiscountPercentage } from '../value-objects/discount-percentage.value-object';
import { DiscountCurrency } from '../value-objects/discount-currency.value-object';

export interface DiscountBenefitProps {
  amount?: DiscountAmount;
  percentage?: DiscountPercentage;
  currency?: DiscountCurrency;
  freeProductId?: string;
  freeDelivery?: boolean;
}

export class DiscountBenefit extends Entity<DiscountBenefitProps> {
  private constructor(id: string, props: DiscountBenefitProps) {
    super(id, props);
  }

  public static createPercentage(id: string, percentage: DiscountPercentage): DiscountBenefit {
    return new DiscountBenefit(id, { percentage });
  }

  public static createFixedAmount(id: string, amount: DiscountAmount, currency: DiscountCurrency): DiscountBenefit {
    return new DiscountBenefit(id, { amount, currency });
  }

  public static createFreeProduct(id: string, freeProductId: string): DiscountBenefit {
    return new DiscountBenefit(id, { freeProductId });
  }

  public static createFreeDelivery(id: string): DiscountBenefit {
    return new DiscountBenefit(id, { freeDelivery: true });
  }

  get amount(): DiscountAmount | undefined { return this.props.amount; }
  get percentage(): DiscountPercentage | undefined { return this.props.percentage; }
  get currency(): DiscountCurrency | undefined { return this.props.currency; }
  get freeProductId(): string | undefined { return this.props.freeProductId; }
  get freeDelivery(): boolean | undefined { return this.props.freeDelivery; }
}
