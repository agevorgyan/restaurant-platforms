import { Payment } from '../aggregates/payment.aggregate';
import { Authorization } from '../entities/authorization.entity';
import { AuthorizationSpecification } from '../specifications/authorization.specification';

export class AuthorizationPolicy {
  private readonly authSpec = new AuthorizationSpecification();

  public evaluate(payment: Payment, authorization: Authorization): { isSuccess: boolean; error?: string } {
    if (!this.authSpec.isSatisfiedBy(payment, authorization)) {
      return { isSuccess: false, error: 'Invalid authorization: already exists, expired, or currency mismatch' };
    }

    return { isSuccess: true };
  }
}
