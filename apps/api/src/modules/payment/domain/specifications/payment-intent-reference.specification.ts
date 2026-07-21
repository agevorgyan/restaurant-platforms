import { PaymentIntent } from '../aggregates/payment-intent.aggregate';

export class PaymentIntentReferenceSpecification {
  public isSatisfiedBy(intent: PaymentIntent): boolean {
    return (
      intent.orderId !== null &&
      intent.checkoutSessionId !== null &&
      intent.orderQuotationId !== null &&
      intent.pricingSnapshotId !== null
    );
  }
}
