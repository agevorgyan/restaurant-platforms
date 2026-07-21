import { Entity } from '@saas/core';
import { Money } from '../../../finance/domain/value-objects/money.value-object';

export interface QuotationTaxProps {
  taxRuleId: string;
  taxCode: string;
  amount: Money;
}

export class QuotationTax extends Entity<QuotationTaxProps> {
  private constructor(id: string, props: QuotationTaxProps) {
    super(id, props);
  }

  public static create(id: string, props: QuotationTaxProps): QuotationTax {
    return new QuotationTax(id, props);
  }

  get taxRuleId(): string { return this.props.taxRuleId; }
  get taxCode(): string { return this.props.taxCode; }
  get amount(): Money { return this.props.amount; }
}
