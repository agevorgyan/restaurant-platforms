import { PricingRule } from '../aggregates/pricing-rule.aggregate';

export class PricingRuleApplicabilitySpecification {
  /**
   * Evaluates if a rule is applicable to a given context payload.
   * (Mock implementation of the interface for domain structure purposes).
   */
  public isSatisfiedBy(rule: PricingRule, evaluationContext: Record<string, any>, evaluationDate: Date = new Date()): boolean {
    if (!rule.status.isActive()) {
      return false;
    }
    if (rule.effectivePeriod && !rule.effectivePeriod.isActiveAt(evaluationDate)) {
      return false;
    }
    
    // In a fully built pipeline, this would cross-reference `rule.conditions` against `evaluationContext`
    return true;
  }
}
