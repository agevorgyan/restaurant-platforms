import { ValueObject } from '@saas/core';

export interface PaymentIntentVersionProps {
  value: number;
}

export class PaymentIntentVersion extends ValueObject<PaymentIntentVersionProps> {
  private constructor(props: PaymentIntentVersionProps) {
    super(props);
  }

  public static create(value: number = 1): PaymentIntentVersion {
    if (!Number.isInteger(value) || value < 1) {
      throw new Error('PaymentIntentVersion must be a positive integer');
    }
    return new PaymentIntentVersion({ value });
  }

  public increment(): PaymentIntentVersion {
    return new PaymentIntentVersion({ value: this.props.value + 1 });
  }

  get value(): number {
    return this.props.value;
  }
}
