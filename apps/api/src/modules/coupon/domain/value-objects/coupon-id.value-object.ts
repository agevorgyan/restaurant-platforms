import { ValueObject } from '@saas/core';

export interface CouponIdProps {
  value: string;
}

export class CouponId extends ValueObject<CouponIdProps> {
  private constructor(props: CouponIdProps) {
    super(props);
  }

  public static create(value: string): CouponId {
    if (!value || value.trim().length === 0) {
      throw new Error('CouponId cannot be empty');
    }
    return new CouponId({ value });
  }

  get value(): string {
    return this.props.value;
  }
}
