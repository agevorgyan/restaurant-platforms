import { Payment } from '../aggregates/payment.aggregate';
import { Refund } from '../entities/refund.entity';

export class RefundConsistencySpecification {
  public isSatisfiedBy(payment: Payment, refund: Refund): boolean {
    if (payment.amount.currency !== refund.amount.currency) {
      return false;
    }

    const totalCaptured = payment.getTotalCapturedAmount();
    const totalRefunded = payment.getTotalRefundedAmount();
    
    if (totalRefunded + refund.amount.value > totalCaptured) {
      return false;
    }

    return true;
  }
}
