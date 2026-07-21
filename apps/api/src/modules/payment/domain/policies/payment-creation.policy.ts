import { Payment } from '../aggregates/payment.aggregate';
import { PaymentConsistencySpecification } from '../specifications/payment-consistency.specification';

export class PaymentCreationPolicy {
  private readonly consistencySpec = new PaymentConsistencySpecification();

  public evaluate(payment: Payment): { isSuccess: boolean; error?: string } {
    if (!this.consistencySpec.isSatisfiedBy(payment)) {
      return { isSuccess: false, error: 'Payment state is inconsistent or missing required references' };
    }

    return { isSuccess: true };
  }
}
