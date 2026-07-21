import { ValueObject } from '@saas/core';

export interface CouponCodeProps {
  value: string;
}

export class CouponCode extends ValueObject<CouponCodeProps> {
  private constructor(props: CouponCodeProps) {
    super(props);
  }

  public static create(value: string): CouponCode {
    if (!value || value.trim().length === 0) {
      throw new Error('Coupon code cannot be empty');
    }
    // Simple format validation: alphanumeric only, uppercase usually, maybe some dashes
    const codeRegex = /^[A-Z0-9-]+$/i;
    if (!codeRegex.test(value)) {
      throw new Error('Coupon code format is invalid. Only alphanumeric characters and dashes are allowed.');
    }

    return new CouponCode({ value: value.toUpperCase() });
  }

  get value(): string {
    return this.props.value;
  }
}
