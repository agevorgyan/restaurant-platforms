import { ValueObject } from '@saas/core';

export enum PaymentStatusEnum {
  CREATED = 'Created',
  PENDING_AUTHORIZATION = 'PendingAuthorization',
  AUTHORIZED = 'Authorized',
  PARTIALLY_CAPTURED = 'PartiallyCaptured',
  CAPTURED = 'Captured',
  PARTIALLY_REFUNDED = 'PartiallyRefunded',
  REFUNDED = 'Refunded',
  FAILED = 'Failed',
  CANCELLED = 'Cancelled',
  VOIDED = 'Voided',
  CHARGEBACK = 'Chargeback'
}

export interface PaymentStatusProps {
  value: PaymentStatusEnum;
}

export class PaymentStatus extends ValueObject<PaymentStatusProps> {
  private constructor(props: PaymentStatusProps) {
    super(props);
  }

  public static create(value: PaymentStatusEnum): PaymentStatus {
    if (!Object.values(PaymentStatusEnum).includes(value)) {
      throw new Error(`Unsupported payment status: ${value}`);
    }
    return new PaymentStatus({ value });
  }

  get value(): PaymentStatusEnum {
    return this.props.value;
  }
}
