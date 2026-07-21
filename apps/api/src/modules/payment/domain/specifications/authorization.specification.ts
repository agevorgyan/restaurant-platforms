import { Payment } from '../aggregates/payment.aggregate';
import { Authorization } from '../entities/authorization.entity';

export class AuthorizationSpecification {
  public isSatisfiedBy(payment: Payment, authorization: Authorization): boolean {
    // Check if another active authorization exists
    if (payment.authorization && !payment.authorization.isExpired() && !payment.authorization.isVoided) {
      return false;
    }

    // Ensure currency matches
    if (payment.amount.currency !== authorization.amount.currency) {
      return false;
    }

    return true;
  }
}
