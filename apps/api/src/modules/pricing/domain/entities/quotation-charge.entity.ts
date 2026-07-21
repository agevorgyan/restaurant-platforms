import { Entity } from '@saas/core';
import { Money } from '../../../finance/domain/value-objects/money.value-object';

export interface QuotationChargeProps {
  chargeRuleId: string;
  chargeCode: string;
  amount: Money;
}

export class QuotationCharge extends Entity<QuotationChargeProps> {
  private constructor(id: string, props: QuotationChargeProps) {
    super(id, props);
  }

  public static create(id: string, props: QuotationChargeProps): QuotationCharge {
    return new QuotationCharge(id, props);
  }

  get chargeRuleId(): string { return this.props.chargeRuleId; }
  get chargeCode(): string { return this.props.chargeCode; }
  get amount(): Money { return this.props.amount; }
}
