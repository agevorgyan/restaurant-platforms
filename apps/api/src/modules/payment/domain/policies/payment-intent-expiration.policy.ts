import { PaymentIntent } from '../aggregates/payment-intent.aggregate';
import { PaymentIntentExpirationSpecification } from '../specifications/payment-intent-expiration.specification';
import { PaymentIntentStatusEnum } from '../value-objects/payment-intent-status.value-object';

export class PaymentIntentExpirationPolicy {
  private readonly expirationSpec = new PaymentIntentExpirationSpecification();

  public evaluate(intent: PaymentIntent, now: Date = new Date()): { isSuccess: boolean; error?: string } {
    // If it's already in a terminal/finalized state, expiration check passes as a no-op
    const terminalStates = [
      PaymentIntentStatusEnum.EXPIRED,
      PaymentIntentStatusEnum.AUTHORIZED,
      PaymentIntentStatusEnum.CANCELLED,
      PaymentIntentStatusEnum.FAILED
    ];

    if (terminalStates.includes(intent.status.value)) {
      return { isSuccess: true };
    }

    if (!this.expirationSpec.isSatisfiedBy(intent, now)) {
      return { isSuccess: false, error: 'Payment Intent has expired' };
    }

    return { isSuccess: true };
  }
}
