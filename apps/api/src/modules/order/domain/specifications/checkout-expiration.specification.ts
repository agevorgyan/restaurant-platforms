import { CheckoutSession } from '../aggregates/checkout-session.aggregate';

export class CheckoutExpirationSpecification {
  public isSatisfiedBy(session: CheckoutSession, referenceDate: Date = new Date()): boolean {
    return !session.isExpired(referenceDate);
  }
}
