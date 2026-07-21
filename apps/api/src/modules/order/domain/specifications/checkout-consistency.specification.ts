import { CheckoutSession } from '../aggregates/checkout-session.aggregate';

export class CheckoutConsistencySpecification {
  public isSatisfiedBy(session: CheckoutSession): boolean {
    // The main rule here is ensuring the PricingSnapshot and OrderQuotation
    // references are present and structurally sound.
    // At this pure domain level (without an external service), we just ensure
    // they are not null and are valid UUIDs via the Value Object constraints.
    return !!session.reference.orderQuotationId && !!session.reference.pricingSnapshotId;
  }
}
