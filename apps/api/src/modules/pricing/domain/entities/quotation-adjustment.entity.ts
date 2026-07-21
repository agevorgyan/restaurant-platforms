import { Entity } from '@saas/core';
import { Money } from '../../../finance/domain/value-objects/money.value-object';

export interface QuotationAdjustmentProps {
  ruleId: string;
  description: string;
  amount: Money;
}

export class QuotationAdjustment extends Entity<QuotationAdjustmentProps> {
  private constructor(id: string, props: QuotationAdjustmentProps) {
    super(id, props);
  }

  public static create(id: string, props: QuotationAdjustmentProps): QuotationAdjustment {
    return new QuotationAdjustment(id, props);
  }

  get ruleId(): string { return this.props.ruleId; }
  get description(): string { return this.props.description; }
  get amount(): Money { return this.props.amount; }
}
