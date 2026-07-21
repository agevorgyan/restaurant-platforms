import { PaymentIntent } from '../aggregates/payment-intent.aggregate';

export class PaymentIntentExpirationSpecification {
  public isSatisfiedBy(intent: PaymentIntent, now: Date = new Date()): boolean {
    return !intent.isExpired(now);
  }
}
