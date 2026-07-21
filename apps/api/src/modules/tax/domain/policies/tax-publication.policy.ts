import { TaxPolicy } from '../aggregates/tax-policy.aggregate';

export class TaxPublicationPolicy {
  public canPublish(policy: TaxPolicy): boolean {
    if (policy.status.isArchived()) {
      return false;
    }
    
    if (policy.rules.length === 0) {
      return false;
    }
    
    return true;
  }
}
