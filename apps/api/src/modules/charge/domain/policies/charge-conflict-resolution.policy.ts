import { ChargePolicy } from '../aggregates/charge-policy.aggregate';

export class ChargeConflictResolutionPolicy {
  public resolve(policies: ChargePolicy[]): ChargePolicy[] {
    if (policies.length <= 1) {
      return policies;
    }

    return [...policies].sort((a, b) => {
      // Sort primarily by priority
      if (a.priority && b.priority) {
        return b.priority.value - a.priority.value; // Higher value first
      }
      if (a.priority) return -1;
      if (b.priority) return 1;
      return 0;
    });
  }
}
