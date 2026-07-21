import { Entity } from '@saas/core';
import { Money } from '../../../finance/domain/value-objects/money.value-object';

export interface AppliedChargeProps {
  chargeRuleId: string;
  chargeAmount: Money;
  chargeCode: string;
}

export class AppliedCharge extends Entity<AppliedChargeProps> {
  private constructor(id: string, props: AppliedChargeProps) {
    super(id, props);
  }

  public static create(id: string, props: AppliedChargeProps): AppliedCharge {
    return new AppliedCharge(id, props);
  }

  get chargeRuleId(): string { return this.props.chargeRuleId; }
  get chargeAmount(): Money { return this.props.chargeAmount; }
  get chargeCode(): string { return this.props.chargeCode; }
}
