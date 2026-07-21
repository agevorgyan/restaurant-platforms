import { TaxPolicy } from '../aggregates/tax-policy.aggregate';
import { TaxRule } from '../entities/tax-rule.entity';
import { TaxJurisdictionSpecification } from '../specifications/tax-jurisdiction.specification';
import { TaxExemptionSpecification } from '../specifications/tax-exemption.specification';
import { TaxJurisdictionType } from '../entities/tax-jurisdiction.entity';
import { TaxExemptionType } from '../entities/tax-exemption.entity';
import { TaxCategoryType } from '../entities/tax-category.entity';

export interface TaxEvaluationContext {
  jurisdictions: Record<TaxJurisdictionType, string>;
  exemptions: Record<TaxExemptionType, string[]>;
  categories: Record<TaxCategoryType, string[]>;
}

export class TaxCalculationPolicy {
  constructor(
    private readonly jurisdictionSpec: TaxJurisdictionSpecification,
    private readonly exemptionSpec: TaxExemptionSpecification
  ) {}

  public evaluateApplicableRules(policy: TaxPolicy, context: TaxEvaluationContext): TaxRule[] {
    if (this.exemptionSpec.isSatisfiedBy(policy.exemptions, context.exemptions)) {
      return []; // Policy is completely exempt
    }

    return policy.rules.filter(rule => {
      // Must match at least one jurisdiction
      const matchesJurisdiction = rule.jurisdictions.some(j => 
        this.jurisdictionSpec.isSatisfiedBy(j, context.jurisdictions)
      );
      if (!matchesJurisdiction) {
        return false;
      }

      // Must match at least one category
      const matchesCategory = rule.categories.some(c => {
        const targetValues = context.categories[c.type];
        if (!targetValues) return false;
        // If rule category has no specific value, it applies to all in that category type
        if (!c.value) return targetValues.length > 0;
        return targetValues.includes(c.value);
      });

      return matchesCategory;
    });
  }
}
