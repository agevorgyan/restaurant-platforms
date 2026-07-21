import { TaxPolicy } from '../aggregates/tax-policy.aggregate';

export class TaxPolicyApplicabilitySpecification {
  public isSatisfiedBy(policy: TaxPolicy, evaluationDate: Date = new Date()): boolean {
    if (!policy.status.isActive()) {
      return false;
    }
    if (policy.effectivePeriod && !policy.effectivePeriod.isActiveAt(evaluationDate)) {
      return false;
    }
    return true;
  }
}
