import { CheckoutSession } from '../aggregates/checkout-session.aggregate';
import { CheckoutExpirationSpecification } from '../specifications/checkout-expiration.specification';
import { PolicyResult } from './checkout-creation.policy';
import { CheckoutStatusEnum } from '../value-objects/checkout-status.value-object';

export class CheckoutExpirationPolicy {
  private readonly expirationSpec = new CheckoutExpirationSpecification();

  public evaluate(session: CheckoutSession): PolicyResult {
    if (session.status.value === CheckoutStatusEnum.COMPLETED || session.status.value === CheckoutStatusEnum.CANCELLED) {
      return { isSuccess: true }; // Terminal states (other than EXPIRED) are fine
    }

    if (!this.expirationSpec.isSatisfiedBy(session)) {
      return { isFailure: true, error: 'Checkout session has expired' };
    }

    return { isSuccess: true };
  }
}
