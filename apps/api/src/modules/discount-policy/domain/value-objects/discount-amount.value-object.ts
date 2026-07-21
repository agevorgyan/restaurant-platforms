import { ValueObject } from '@saas/core';

export interface DiscountAmountProps {
  value: number;
}

export class DiscountAmount extends ValueObject<DiscountAmountProps> {
  private constructor(props: DiscountAmountProps) {
    super(props);
  }

  public static create(value: number): DiscountAmount {
    if (value < 0) {
      throw new Error('Discount amount cannot be negative');
    }
    return new DiscountAmount({ value });
  }

  get value(): number {
    return this.props.value;
  }
}
