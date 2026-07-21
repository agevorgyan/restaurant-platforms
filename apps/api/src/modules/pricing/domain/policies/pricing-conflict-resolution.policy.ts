import { PricingRule } from '../aggregates/pricing-rule.aggregate';

export class PricingConflictResolutionPolicy {
  public resolve(conflictingRules: PricingRule[]): PricingRule[] {
    if (conflictingRules.length <= 1) {
      return conflictingRules;
    }

    // Sort by explicit order, then by weight
    const sorted = [...conflictingRules].sort((a, b) => {
      if (a.priority && b.priority) {
        if (a.priority.explicitOrder !== undefined && b.priority.explicitOrder !== undefined) {
          if (a.priority.explicitOrder !== b.priority.explicitOrder) {
            return a.priority.explicitOrder - b.priority.explicitOrder;
          }
        }
        return b.priority.weight - a.priority.weight; // Higher weight first
      }
      return 0;
    });

    // Strategy evaluation could be implemented here (e.g., return only the single rule if HIGHEST_DISCOUNT)
    // For now, we return the sorted list prioritizing highest weight.
    return sorted;
  }
}
