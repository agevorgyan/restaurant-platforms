import { PaymentStatusEnum } from '../value-objects/payment-status.value-object';

export class ValidPaymentTransitionSpecification {
  private static readonly transitionMatrix: Record<PaymentStatusEnum, PaymentStatusEnum[]> = {
    [PaymentStatusEnum.CREATED]: [PaymentStatusEnum.PENDING_AUTHORIZATION, PaymentStatusEnum.CANCELLED],
    [PaymentStatusEnum.PENDING_AUTHORIZATION]: [PaymentStatusEnum.AUTHORIZED, PaymentStatusEnum.FAILED, PaymentStatusEnum.CANCELLED],
    [PaymentStatusEnum.AUTHORIZED]: [PaymentStatusEnum.PARTIALLY_CAPTURED, PaymentStatusEnum.CAPTURED, PaymentStatusEnum.VOIDED],
    [PaymentStatusEnum.PARTIALLY_CAPTURED]: [PaymentStatusEnum.PARTIALLY_CAPTURED, PaymentStatusEnum.CAPTURED, PaymentStatusEnum.PARTIALLY_REFUNDED],
    [PaymentStatusEnum.CAPTURED]: [PaymentStatusEnum.PARTIALLY_REFUNDED, PaymentStatusEnum.REFUNDED, PaymentStatusEnum.CHARGEBACK],
    [PaymentStatusEnum.PARTIALLY_REFUNDED]: [PaymentStatusEnum.PARTIALLY_REFUNDED, PaymentStatusEnum.REFUNDED, PaymentStatusEnum.CHARGEBACK],
    [PaymentStatusEnum.REFUNDED]: [], // terminal
    [PaymentStatusEnum.VOIDED]: [], // terminal
    [PaymentStatusEnum.CANCELLED]: [], // terminal
    [PaymentStatusEnum.FAILED]: [], // terminal
    [PaymentStatusEnum.CHARGEBACK]: [] // terminal
  };

  public isSatisfiedBy(currentStatus: PaymentStatusEnum, nextStatus: PaymentStatusEnum): boolean {
    const allowedTransitions = ValidPaymentTransitionSpecification.transitionMatrix[currentStatus] || [];
    return allowedTransitions.includes(nextStatus);
  }
}
