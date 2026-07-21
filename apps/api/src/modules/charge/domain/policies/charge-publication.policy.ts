import { ChargePolicy } from '../aggregates/charge-policy.aggregate';

export class ChargePublicationPolicy {
  public canPublish(policy: ChargePolicy): boolean {
    if (policy.status.isArchived()) {
      return false;
    }
    
    if (policy.rules.length === 0) {
      return false;
    }
    
    return true;
  }
}
