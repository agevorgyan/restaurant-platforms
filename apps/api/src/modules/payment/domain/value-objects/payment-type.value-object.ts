import { ValueObject } from '@saas/core';

export enum PaymentTypeEnum {
  AUTHORIZATION = 'Authorization',
  CAPTURE = 'Capture',
  SALE = 'Sale',
  REFUND = 'Refund',
  VOID = 'Void',
  CHARGEBACK = 'Chargeback'
}

export interface PaymentTypeProps {
  value: PaymentTypeEnum;
}

export class PaymentType extends ValueObject<PaymentTypeProps> {
  private constructor(props: PaymentTypeProps) {
    super(props);
  }

  public static create(value: PaymentTypeEnum): PaymentType {
    if (!Object.values(PaymentTypeEnum).includes(value)) {
      throw new Error(`Unsupported payment type: ${value}`);
    }
    return new PaymentType({ value });
  }

  get value(): PaymentTypeEnum {
    return this.props.value;
  }
}
