import { ValueObject } from '@saas/core';
import { Money } from '../../../finance/domain/value-objects/money.value-object';

export interface PricingResultProps {
  baseTotal: Money;
  ruleAdjustmentsTotal: Money;
  marketingDiscountsTotal: Money;
  taxTotal: Money;
  chargeTotal: Money;
  grandTotal: Money;
}

export class PricingResult extends ValueObject<PricingResultProps> {
  private constructor(props: PricingResultProps) {
    super(props);
  }

  public static create(props: PricingResultProps): PricingResult {
    // Grand total should theoretically be: Base + RuleAdjustments + MarketingDiscounts + Tax + Charge
    // Since adjustments/discounts are usually negative, we just sum them if they are modeled with proper signs.
    
    // Validate currency consistency
    const currencies = [
      props.baseTotal,
      props.ruleAdjustmentsTotal,
      props.marketingDiscountsTotal,
      props.taxTotal,
      props.chargeTotal,
      props.grandTotal,
    ].map(m => m.currency.code);

    const firstCurrency = currencies[0];
    if (currencies.some(c => c !== firstCurrency)) {
      throw new Error('All totals in PricingResult must have the same currency');
    }

    return new PricingResult(props);
  }

  get baseTotal(): Money { return this.props.baseTotal; }
  get ruleAdjustmentsTotal(): Money { return this.props.ruleAdjustmentsTotal; }
  get marketingDiscountsTotal(): Money { return this.props.marketingDiscountsTotal; }
  get taxTotal(): Money { return this.props.taxTotal; }
  get chargeTotal(): Money { return this.props.chargeTotal; }
  get grandTotal(): Money { return this.props.grandTotal; }
}
