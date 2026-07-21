import { Payment } from '../aggregates/payment.aggregate';
import { Refund } from '../entities/refund.entity';

export class RefundSpecification {
  public isSatisfiedBy(payment: Payment, refund: Refund): boolean {
    if (payment.amount.currency !== refund.amount.currency) {
      return false;
    }

    const totalCaptured = payment.getTotalCapturedAmount();
    const totalRefunded = payment.getTotalRefundedAmount();
    const newTotalRefunded = totalRefunded + refund.amount.value;

    if (newTotalRefunded > totalCaptured) {
      return false;
    }

    return true;
  }
}
