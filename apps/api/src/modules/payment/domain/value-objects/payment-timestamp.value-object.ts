import { ValueObject } from '@saas/core';

export interface PaymentTimestampProps {
  value: Date;
}

export class PaymentTimestamp extends ValueObject<PaymentTimestampProps> {
  private constructor(props: PaymentTimestampProps) {
    super(props);
  }

  public static create(value: Date): PaymentTimestamp {
    if (!(value instanceof Date) || isNaN(value.getTime())) {
      throw new Error('PaymentTimestamp must be a valid Date object');
    }
    return new PaymentTimestamp({ value });
  }

  public static now(): PaymentTimestamp {
    return new PaymentTimestamp({ value: new Date() });
  }

  get value(): Date {
    return this.props.value;
  }
}
