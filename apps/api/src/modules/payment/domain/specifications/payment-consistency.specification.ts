import { Payment } from '../aggregates/payment.aggregate';

export class PaymentConsistencySpecification {
  public isSatisfiedBy(payment: Payment): boolean {
    if (!payment.paymentIntentId || !payment.orderId || !payment.pricingSnapshotId || !payment.orderQuotationId) {
      return false;
    }

    if (!payment.amount) {
      return false;
    }

    return true;
  }
}
