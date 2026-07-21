import { CheckoutSession } from '../aggregates/checkout-session.aggregate';

export class CheckoutQuotationSpecification {
  public isSatisfiedBy(session: CheckoutSession): boolean {
    // A Checkout Session cannot exist without a valid quotation reference.
    return !!session.reference.orderQuotationId;
  }
}
