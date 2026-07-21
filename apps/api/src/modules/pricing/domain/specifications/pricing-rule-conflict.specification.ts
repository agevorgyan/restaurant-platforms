import { PricingRule } from '../aggregates/pricing-rule.aggregate';
import { PricingConstraintType } from '../entities/pricing-constraint.entity';

export class PricingRuleConflictSpecification {
  public isSatisfiedBy(rule1: PricingRule, rule2: PricingRule): boolean {
    // If either rule is strictly non-combinable, it's a conflict
    const isRule1NonCombinable = rule1.constraints.some(c => c.type === PricingConstraintType.NON_COMBINABLE);
    const isRule2NonCombinable = rule2.constraints.some(c => c.type === PricingConstraintType.NON_COMBINABLE);

    if (isRule1NonCombinable || isRule2NonCombinable) {
      return true;
    }

    return false;
  }
}
