import { PaymentIntent } from '../aggregates/payment-intent.aggregate';

export class PaymentIntentConsistencySpecification {
  public isSatisfiedBy(intent: PaymentIntent): boolean {
    const refs = [
      intent.orderId.value,
      intent.checkoutSessionId.value,
      intent.orderQuotationId.value,
      intent.pricingSnapshotId.value
    ];
    
    // Check for duplicate references
    if (new Set(refs).size !== refs.length) {
      return false;
    }
    
    // Ensure critical elements are present
    if (!intent.amount || !intent.expiration) {
      return false;
    }

    return true;
  }
}
