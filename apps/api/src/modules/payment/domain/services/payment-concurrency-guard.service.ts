import { Payment } from '../aggregates/payment.aggregate';

export class PaymentConcurrencyGuard {
  public validate(payment: Payment, expectedVersionNumber: number): void {
    if (payment.version.value !== expectedVersionNumber) {
      throw new Error(`Concurrency exception: Expected version ${expectedVersionNumber} but got ${payment.version.value}`);
    }
  }
}
