import { TaxPolicy } from '../aggregates/tax-policy.aggregate';

export class TaxConflictResolutionPolicy {
  public resolve(policies: TaxPolicy[]): TaxPolicy[] {
    if (policies.length <= 1) {
      return policies;
    }

    return [...policies].sort((a, b) => {
      // Sort primarily by priority
      if (a.priority && b.priority) {
        return b.priority.value - a.priority.value;
      }
      if (a.priority) return -1;
      if (b.priority) return 1;
      return 0;
    });
  }
}
