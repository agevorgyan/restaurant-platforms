import { Payment } from '../aggregates/payment.aggregate';
import { Chargeback } from '../entities/chargeback.entity';

export class ChargebackPolicy {
  public evaluate(payment: Payment, chargeback: Chargeback): { isSuccess: boolean; error?: string } {
    const captureExists = payment.captures.some(
      (c) => c.reference.value === chargeback.captureReference.value
    );

    if (!captureExists) {
      return { isSuccess: false, error: 'Chargeback must reference a valid capture' };
    }

    if (payment.amount.currency !== chargeback.amount.currency) {
      return { isSuccess: false, error: 'Currency mismatch for chargeback' };
    }

    return { isSuccess: true };
  }
}
