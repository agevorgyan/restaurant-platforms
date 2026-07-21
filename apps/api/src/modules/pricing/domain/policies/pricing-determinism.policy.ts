import { PricingSession } from '../aggregates/pricing-session.aggregate';
import { CalculationTrace } from '../value-objects/calculation-trace.value-object';

export class PricingDeterminismPolicy {
  public enforce(session: PricingSession, trace: CalculationTrace): void {
    if (!trace || trace.steps.length === 0) {
      throw new Error('Pricing execution trace is empty. Calculation must be deterministic and fully traced.');
    }
  }
}
