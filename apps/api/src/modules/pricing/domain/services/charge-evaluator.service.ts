import { PricingSession } from '../aggregates/pricing-session.aggregate';
import { AppliedCharge } from '../entities/applied-charge.entity';

export class ChargeEvaluator {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public evaluate(_session: PricingSession): AppliedCharge[] {
    // In a real implementation, this service would interact with the Charge Policy Engine
    // (EPIC 11.3) to evaluate charge rules. For now, it represents the architectural contract.
    return [];
  }
}
