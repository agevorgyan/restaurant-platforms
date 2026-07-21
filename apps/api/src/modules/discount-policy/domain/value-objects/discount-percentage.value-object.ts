import { ValueObject } from '@saas/core';

export interface DiscountPercentageProps {
  value: number;
}

export class DiscountPercentage extends ValueObject<DiscountPercentageProps> {
  private constructor(props: DiscountPercentageProps) {
    super(props);
  }

  public static create(value: number): DiscountPercentage {
    if (value < 0 || value > 100) {
      throw new Error('Discount percentage must be between 0 and 100');
    }
    return new DiscountPercentage({ value });
  }

  get value(): number {
    return this.props.value;
  }
}
