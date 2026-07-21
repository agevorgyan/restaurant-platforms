import { PricingRule } from '../aggregates/pricing-rule.aggregate';
import { PricingRuleId } from '../value-objects/pricing-rule-id.value-object';
import { PricingRuleCode } from '../value-objects/pricing-rule-code.value-object';

export interface PricingRuleRepository {
  findById(id: PricingRuleId): Promise<PricingRule | null>;
  findByCode(code: PricingRuleCode): Promise<PricingRule | null>;
  save(rule: PricingRule): Promise<void>;
  findActiveRules(date: Date): Promise<PricingRule[]>;
}
