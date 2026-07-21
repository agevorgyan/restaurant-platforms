import { PricingRule } from '../aggregates/pricing-rule.aggregate';
import { PricingRuleApplicabilitySpecification } from '../specifications/pricing-rule-applicability.specification';
import { PricingRuleConflictSpecification } from '../specifications/pricing-rule-conflict.specification';
import { PricingConflictResolutionPolicy } from './pricing-conflict-resolution.policy';

export class PricingEvaluationPolicy {
  constructor(
    private readonly applicabilitySpec: PricingRuleApplicabilitySpecification,
    private readonly conflictSpec: PricingRuleConflictSpecification,
    private readonly resolutionPolicy: PricingConflictResolutionPolicy
  ) {}

  public evaluate(rules: PricingRule[], context: Record<string, any>, date: Date = new Date()): PricingRule[] {
    const applicableRules = rules.filter(rule => this.applicabilitySpec.isSatisfiedBy(rule, context, date));
    
    // In a real scenario, this policy would cluster conflicting rules based on the conflictSpec,
    // and then resolve each cluster using the resolutionPolicy.
    return this.resolutionPolicy.resolve(applicableRules);
  }
}
