import { ValueObject } from '@saas/core';
import { Money } from './money.value-object';

export interface PriceBreakdownProps {
  baseAmount: Money;
  discounts: Money;
  taxes: Money;
  fees: Money;
  finalTotal: Money;
}

export class PriceBreakdown extends ValueObject<PriceBreakdownProps> {
  private constructor(props: PriceBreakdownProps) {
    super(props);
  }

  public static create(props: PriceBreakdownProps): PriceBreakdown {
    const currency = props.baseAmount.currency;

    // Validate that all components share the same currency
    if (!props.discounts.currency.equals(currency) ||
        !props.taxes.currency.equals(currency) ||
        !props.fees.currency.equals(currency) ||
        !props.finalTotal.currency.equals(currency)) {
      throw new Error('All components of a PriceBreakdown must use the same currency');
    }

    // While PriceBreakdown doesn't inherently recalculate the pricing logic (it merely models the result),
    // we can enforce basic mathematical integrity (base - discounts + taxes + fees == final)
    const expectedFinal = props.baseAmount
      .subtract(props.discounts)
      .add(props.taxes)
      .add(props.fees);

    if (!expectedFinal.equals(props.finalTotal)) {
      throw new Error('PriceBreakdown components do not compute to the final total');
    }

    return new PriceBreakdown(props);
  }

  get baseAmount(): Money { return this.props.baseAmount; }
  get discounts(): Money { return this.props.discounts; }
  get taxes(): Money { return this.props.taxes; }
  get fees(): Money { return this.props.fees; }
  get finalTotal(): Money { return this.props.finalTotal; }
}
