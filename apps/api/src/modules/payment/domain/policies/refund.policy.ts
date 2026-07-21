import { Payment } from '../aggregates/payment.aggregate';
import { Refund } from '../entities/refund.entity';
import { RefundSpecification } from '../specifications/refund.specification';

export class RefundPolicy {
  private readonly refundSpec = new RefundSpecification();

  public evaluate(payment: Payment, refund: Refund): { isSuccess: boolean; error?: string } {
    if (!this.refundSpec.isSatisfiedBy(payment, refund)) {
      return { isSuccess: false, error: 'Refund exceeds captured amount or currency mismatch' };
    }

    return { isSuccess: true };
  }
}
