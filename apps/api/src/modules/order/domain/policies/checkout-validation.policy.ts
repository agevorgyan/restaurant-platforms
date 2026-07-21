import { CheckoutSession } from '../aggregates/checkout-session.aggregate';
import { CheckoutCreationPolicy } from './checkout-creation.policy';
import { CheckoutExpirationPolicy } from './checkout-expiration.policy';
import { PolicyResult } from './checkout-creation.policy';

export class CheckoutValidationPolicy {
  private readonly expirationPolicy = new CheckoutExpirationPolicy();
  private readonly creationPolicy = new CheckoutCreationPolicy();

  public validateState(session: CheckoutSession): PolicyResult {
    const expirationResult = this.expirationPolicy.evaluate(session);
    if ('isFailure' in expirationResult) {
      return expirationResult;
    }

    return { isSuccess: true };
  }
}
