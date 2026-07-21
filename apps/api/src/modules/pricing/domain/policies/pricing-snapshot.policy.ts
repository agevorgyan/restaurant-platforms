import { PricingSession } from '../aggregates/pricing-session.aggregate';

export class PricingSnapshotPolicy {
  public canGenerateSnapshot(session: PricingSession): boolean {
    if (!session.result) {
      return false; // Cannot snapshot before calculation
    }
    return true;
  }
}
