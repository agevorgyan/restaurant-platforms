import { ValueObject } from '@saas/core';

export interface PaymentVersionProps {
  value: number;
}

export class PaymentVersion extends ValueObject<PaymentVersionProps> {
  private constructor(props: PaymentVersionProps) {
    super(props);
  }

  public static create(value: number = 1): PaymentVersion {
    if (!Number.isInteger(value) || value < 1) {
      throw new Error('PaymentVersion must be a positive integer');
    }
    return new PaymentVersion({ value });
  }

  public increment(): PaymentVersion {
    return new PaymentVersion({ value: this.props.value + 1 });
  }

  get value(): number {
    return this.props.value;
  }
}
