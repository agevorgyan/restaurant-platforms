import { Payment } from '../aggregates/payment.aggregate';
import { Capture } from '../entities/capture.entity';

export class CaptureSpecification {
  public isSatisfiedBy(payment: Payment, capture: Capture): boolean {
    if (!payment.authorization || payment.authorization.isExpired() || payment.authorization.isVoided) {
      return false;
    }

    if (payment.amount.currency !== capture.amount.currency) {
      return false;
    }

    const totalCaptured = payment.getTotalCapturedAmount();
    const newTotalCaptured = totalCaptured + capture.amount.value;

    if (newTotalCaptured > payment.authorization.amount.value) {
      return false;
    }

    return true;
  }
}
