import { PricingSession } from '../aggregates/pricing-session.aggregate';
import { AppliedPricingRule } from '../entities/applied-pricing-rule.entity';

export class PricingRuleEvaluator {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public evaluate(_session: PricingSession): AppliedPricingRule[] {
    // In a real implementation, this service would interact with the PricingRule Engine
    // (EPIC 11.1) to resolve rules. For now, it represents the architectural contract.
    return [];
  }
}
