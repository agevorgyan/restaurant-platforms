import { Entity } from '@saas/core';
import { Money } from '../../../finance/domain/value-objects/money.value-object';

export interface AppliedPricingRuleProps {
  ruleId: string;
  adjustmentAmount: Money; // Could be negative for discounts, positive for surcharges
}

export class AppliedPricingRule extends Entity<AppliedPricingRuleProps> {
  private constructor(id: string, props: AppliedPricingRuleProps) {
    super(id, props);
  }

  public static create(id: string, props: AppliedPricingRuleProps): AppliedPricingRule {
    return new AppliedPricingRule(id, props);
  }

  get ruleId(): string { return this.props.ruleId; }
  get adjustmentAmount(): Money { return this.props.adjustmentAmount; }
}
