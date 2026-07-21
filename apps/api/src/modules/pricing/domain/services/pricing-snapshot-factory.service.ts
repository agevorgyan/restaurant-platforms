import { PricingSession } from '../aggregates/pricing-session.aggregate';
import { PricingSnapshot } from '../value-objects/pricing-snapshot.value-object';
import { PricingSnapshotPolicy } from '../policies/pricing-snapshot.policy';

export class PricingSnapshotFactory {
  constructor(private readonly policy: PricingSnapshotPolicy) {}

  public createSnapshot(session: PricingSession): PricingSnapshot {
    if (!this.policy.canGenerateSnapshot(session)) {
      throw new Error('Cannot generate snapshot for this session. It must be calculated first.');
    }

    const data = {
      sessionId: session.sessionId.value,
      context: session.context,
      result: session.result,
      lineItems: session.lineItems.map(item => ({
        id: item.id,
        productId: item.productId,
        quantity: item.quantity,
        basePrice: item.basePrice.amount,
        totalBasePrice: item.totalBasePrice.amount
      })),
      appliedRules: session.appliedRules,
      appliedTaxes: session.appliedTaxes,
      appliedCharges: session.appliedCharges,
      trace: session.trace?.steps,
    };

    return PricingSnapshot.create(data, session.version.value);
  }
}
