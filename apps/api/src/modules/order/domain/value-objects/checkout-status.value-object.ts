import { ValueObject } from '@saas/core';

export enum CheckoutStatusEnum {
  CREATED = 'Created',
  ACTIVE = 'Active',
  AWAITING_PAYMENT = 'AwaitingPayment',
  PAYMENT_AUTHORIZED = 'PaymentAuthorized',
  COMPLETED = 'Completed',
  EXPIRED = 'Expired',
  CANCELLED = 'Cancelled',
  ABANDONED = 'Abandoned'
}

export interface CheckoutStatusProps {
  value: CheckoutStatusEnum;
}

export class CheckoutStatus extends ValueObject<CheckoutStatusProps> {
  private constructor(props: CheckoutStatusProps) {
    super(props);
  }

  public static create(value: CheckoutStatusEnum): CheckoutStatus {
    if (!Object.values(CheckoutStatusEnum).includes(value)) {
      throw new Error(`Invalid CheckoutStatus: ${value}`);
    }
    return new CheckoutStatus({ value });
  }

  get value(): CheckoutStatusEnum {
    return this.props.value;
  }

  public isTerminal(): boolean {
    return [
      CheckoutStatusEnum.COMPLETED,
      CheckoutStatusEnum.EXPIRED,
      CheckoutStatusEnum.CANCELLED,
      CheckoutStatusEnum.ABANDONED
    ].includes(this.props.value);
  }
}
