import { ValueObject } from '@saas/core';

export enum PaymentIntentStatusEnum {
  CREATED = 'Created',
  ACTIVE = 'Active',
  AWAITING_AUTHORIZATION = 'AwaitingAuthorization',
  AUTHORIZED = 'Authorized',
  EXPIRED = 'Expired',
  CANCELLED = 'Cancelled',
  FAILED = 'Failed'
}

export interface PaymentIntentStatusProps {
  value: PaymentIntentStatusEnum;
}

export class PaymentIntentStatus extends ValueObject<PaymentIntentStatusProps> {
  private constructor(props: PaymentIntentStatusProps) {
    super(props);
  }

  public static create(value: PaymentIntentStatusEnum): PaymentIntentStatus {
    if (!Object.values(PaymentIntentStatusEnum).includes(value)) {
      throw new Error(`Unsupported payment intent status: ${value}`);
    }
    return new PaymentIntentStatus({ value });
  }

  get value(): PaymentIntentStatusEnum {
    return this.props.value;
  }
}
