import { PaymentIntent } from '../aggregates/payment-intent.aggregate';
import { PaymentIntentValidationPolicy } from './payment-intent-validation.policy';
import { PaymentIntentExpirationPolicy } from './payment-intent-expiration.policy';

export class PaymentIntentCreationPolicy {
  private readonly validationPolicy = new PaymentIntentValidationPolicy();
  private readonly expirationPolicy = new PaymentIntentExpirationPolicy();

  public evaluate(intent: PaymentIntent, now: Date = new Date()): { isSuccess: boolean; error?: string } {
    const validationResult = this.validationPolicy.evaluate(intent);
    if (!validationResult.isSuccess) {
      return validationResult;
    }

    const expirationResult = this.expirationPolicy.evaluate(intent, now);
    if (!expirationResult.isSuccess) {
      return { isSuccess: false, error: 'Cannot create an intent that is already expired' };
    }

    return { isSuccess: true };
  }
}
