import { PricingRule } from '../aggregates/pricing-rule.aggregate';

export class PricingRuleValiditySpecification {
  public isSatisfiedBy(rule: PricingRule): boolean {
    if (rule.conditions.length === 0) {
      return false;
    }
    if (rule.actions.length !== 1) {
      return false;
    }
    return true;
  }
}
