import { PricingRule } from '../aggregates/pricing-rule.aggregate';
import { PricingRuleValiditySpecification } from '../specifications/pricing-rule-validity.specification';

export class PricingPublicationPolicy {
  constructor(private readonly validitySpec: PricingRuleValiditySpecification) {}

  public canPublish(rule: PricingRule): boolean {
    // Cannot publish an archived rule
    if (rule.status.isArchived()) {
      return false;
    }
    
    // Must be structurally valid (has conditions and 1 action)
    if (!this.validitySpec.isSatisfiedBy(rule)) {
      return false;
    }
    
    return true;
  }
}
