import { PricingSession } from '../aggregates/pricing-session.aggregate';
import { AppliedTax } from '../entities/applied-tax.entity';

export class TaxEvaluator {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public evaluate(_session: PricingSession): AppliedTax[] {
    // In a real implementation, this service would interact with the Tax Policy Engine
    // (EPIC 11.2) to evaluate tax rules. For now, it represents the architectural contract.
    return [];
  }
}
