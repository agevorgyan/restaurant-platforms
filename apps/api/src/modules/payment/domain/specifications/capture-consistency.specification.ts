import { Payment } from '../aggregates/payment.aggregate';
import { Capture } from '../entities/capture.entity';

export class CaptureConsistencySpecification {
  public isSatisfiedBy(payment: Payment, capture: Capture): boolean {
    if (!payment.authorization || payment.authorization.isVoided || payment.authorization.isExpired()) {
      return false;
    }

    if (payment.amount.currency !== capture.amount.currency) {
      return false;
    }

    const totalCaptured = payment.getTotalCapturedAmount();
    if (totalCaptured + capture.amount.value > payment.authorization.amount.value) {
      return false;
    }

    return true;
  }
}
