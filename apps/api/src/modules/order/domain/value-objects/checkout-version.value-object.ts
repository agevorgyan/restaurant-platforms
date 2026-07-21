import { ValueObject } from '@saas/core';

export interface CheckoutVersionProps {
  value: number;
}

export class CheckoutVersion extends ValueObject<CheckoutVersionProps> {
  private constructor(props: CheckoutVersionProps) {
    super(props);
  }

  public static create(value?: number): CheckoutVersion {
    if (value !== undefined && (value < 1 || !Number.isInteger(value))) {
      throw new Error('CheckoutVersion must be a positive integer');
    }
    return new CheckoutVersion({ value: value ?? 1 });
  }

  public increment(): CheckoutVersion {
    return new CheckoutVersion({ value: this.props.value + 1 });
  }

  get value(): number {
    return this.props.value;
  }
}
