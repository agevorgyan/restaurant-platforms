import { PaymentStatusEnum } from '../value-objects/payment-status.value-object';
import { ValidPaymentTransitionSpecification } from '../specifications/valid-payment-transition.specification';

export class PaymentTransitionPolicy {
  private readonly validTransitionSpec = new ValidPaymentTransitionSpecification();

  public evaluate(currentStatus: PaymentStatusEnum, nextStatus: PaymentStatusEnum): { isSuccess: boolean; error?: string } {
    if (currentStatus === nextStatus) {
      // Identity transition (no-op) is allowed to support idempotency natively
      return { isSuccess: true };
    }

    if (!this.validTransitionSpec.isSatisfiedBy(currentStatus, nextStatus)) {
      return { isSuccess: false, error: `Invalid transition from ${currentStatus} to ${nextStatus}` };
    }

    return { isSuccess: true };
  }
}
