import { Payment } from '../aggregates/payment.aggregate';
import { PaymentStatusEnum } from '../value-objects/payment-status.value-object';
import { PaymentTransitionPolicy } from '../policies/payment-transition.policy';

export class PaymentStateMachine {
  private readonly transitionPolicy = new PaymentTransitionPolicy();

  public transitionTo(payment: Payment, nextStatus: PaymentStatusEnum): void {
    const currentStatus = payment.status.value;
    const policyResult = this.transitionPolicy.evaluate(currentStatus, nextStatus);

    if (!policyResult.isSuccess) {
      throw new Error(policyResult.error);
    }

    if (currentStatus !== nextStatus) {
      // In 13.2, status changes were tightly coupled to aggregate actions like authorize(), capture().
      // This state machine provides a strict outer guard before aggregate state is mutated.
      // We expose a protected way to update status, but for now we enforce the invariant externally.
    }
  }

  public validateTransition(currentStatus: PaymentStatusEnum, nextStatus: PaymentStatusEnum): void {
    const policyResult = this.transitionPolicy.evaluate(currentStatus, nextStatus);
    if (!policyResult.isSuccess) {
      throw new Error(policyResult.error);
    }
  }
}
