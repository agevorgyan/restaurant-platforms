import { Payment } from '../aggregates/payment.aggregate';
import { PaymentStateMachine } from './payment-state-machine.service';
import { Authorization } from '../entities/authorization.entity';
import { Capture } from '../entities/capture.entity';
import { Refund } from '../entities/refund.entity';
import { Chargeback } from '../entities/chargeback.entity';
import { AuthorizationPolicy } from '../policies/authorization.policy';
import { CapturePolicy } from '../policies/capture.policy';
import { RefundPolicy } from '../policies/refund.policy';
import { ChargebackPolicy } from '../policies/chargeback.policy';
import { PaymentStatusEnum } from '../value-objects/payment-status.value-object';
import { PaymentFailureReason } from '../value-objects/payment-failure-reason.value-object';

export class PaymentTransitionManager {
  private readonly stateMachine = new PaymentStateMachine();
  private readonly authPolicy = new AuthorizationPolicy();
  private readonly capturePolicy = new CapturePolicy();
  private readonly refundPolicy = new RefundPolicy();
  private readonly chargebackPolicy = new ChargebackPolicy();

  public applyPendingAuthorization(payment: Payment): void {
    this.stateMachine.validateTransition(payment.status.value, PaymentStatusEnum.PENDING_AUTHORIZATION);
    payment.markPendingAuthorization();
  }

  public applyAuthorization(payment: Payment, authorization: Authorization): void {
    this.stateMachine.validateTransition(payment.status.value, PaymentStatusEnum.AUTHORIZED);
    
    const policyResult = this.authPolicy.evaluate(payment, authorization);
    if (!policyResult.isSuccess) {
      throw new Error(policyResult.error);
    }
    
    payment.authorize(authorization);
  }

  public applyCapture(payment: Payment, capture: Capture): void {
    if (!payment.authorization || payment.authorization.isVoided || payment.authorization.isExpired()) {
      throw new Error('Cannot capture without an active authorization');
    }

    // Determine target state based on amount
    const totalCaptured = payment.getTotalCapturedAmount();
    const newTotalCaptured = totalCaptured + capture.amount.value;
    const targetStatus = newTotalCaptured === payment.authorization.amount.value 
      ? PaymentStatusEnum.CAPTURED 
      : PaymentStatusEnum.PARTIALLY_CAPTURED;

    this.stateMachine.validateTransition(payment.status.value, targetStatus);
    
    const policyResult = this.capturePolicy.evaluate(payment, capture);
    if (!policyResult.isSuccess) {
      throw new Error(policyResult.error);
    }

    payment.capture(capture);
  }

  public applyRefund(payment: Payment, refund: Refund): void {
    const totalCaptured = payment.getTotalCapturedAmount();
    const totalRefunded = payment.getTotalRefundedAmount();
    const newTotalRefunded = totalRefunded + refund.amount.value;
    const targetStatus = newTotalRefunded === totalCaptured
      ? PaymentStatusEnum.REFUNDED
      : PaymentStatusEnum.PARTIALLY_REFUNDED;

    this.stateMachine.validateTransition(payment.status.value, targetStatus);

    const policyResult = this.refundPolicy.evaluate(payment, refund);
    if (!policyResult.isSuccess) {
      throw new Error(policyResult.error);
    }

    payment.refund(refund);
  }

  public applyChargeback(payment: Payment, chargeback: Chargeback): void {
    this.stateMachine.validateTransition(payment.status.value, PaymentStatusEnum.CHARGEBACK);

    const policyResult = this.chargebackPolicy.evaluate(payment, chargeback);
    if (!policyResult.isSuccess) {
      throw new Error(policyResult.error);
    }

    payment.addChargeback(chargeback);
  }

  public applyFailure(payment: Payment, reason: PaymentFailureReason): void {
    this.stateMachine.validateTransition(payment.status.value, PaymentStatusEnum.FAILED);
    payment.fail(reason);
  }

  public applyCancellation(payment: Payment, reason: string): void {
    this.stateMachine.validateTransition(payment.status.value, PaymentStatusEnum.CANCELLED);
    payment.cancel(reason);
  }
}
