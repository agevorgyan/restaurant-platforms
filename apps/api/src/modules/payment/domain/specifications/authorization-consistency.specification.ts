import { Payment } from '../aggregates/payment.aggregate';
import { Authorization } from '../entities/authorization.entity';

export class AuthorizationConsistencySpecification {
  public isSatisfiedBy(payment: Payment, authorization: Authorization): boolean {
    if (payment.authorization && !payment.authorization.isVoided && !payment.authorization.isExpired()) {
      return false; // Prevent duplicate active authorizations
    }
    
    if (payment.amount.currency !== authorization.amount.currency) {
      return false;
    }
    
    return true;
  }
}
