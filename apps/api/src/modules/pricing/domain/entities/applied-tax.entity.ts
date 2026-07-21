import { Entity } from '@saas/core';
import { Money } from '../../../finance/domain/value-objects/money.value-object';

export interface AppliedTaxProps {
  taxRuleId: string;
  taxAmount: Money;
  taxCode: string;
}

export class AppliedTax extends Entity<AppliedTaxProps> {
  private constructor(id: string, props: AppliedTaxProps) {
    super(id, props);
  }

  public static create(id: string, props: AppliedTaxProps): AppliedTax {
    return new AppliedTax(id, props);
  }

  get taxRuleId(): string { return this.props.taxRuleId; }
  get taxAmount(): Money { return this.props.taxAmount; }
  get taxCode(): string { return this.props.taxCode; }
}
