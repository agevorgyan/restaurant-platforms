import { ChargePolicy } from '../aggregates/charge-policy.aggregate';

export class ChargeApplicabilitySpecification {
  public isSatisfiedBy(policy: ChargePolicy, evaluationDate: Date = new Date()): boolean {
    if (!policy.status.isActive()) {
      return false;
    }
    if (policy.effectivePeriod && !policy.effectivePeriod.isActiveAt(evaluationDate)) {
      return false;
    }
    return true;
  }
}
