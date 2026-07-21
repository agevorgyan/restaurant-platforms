import { ValueObject } from '@saas/core';

export interface DiscountLimitProps {
  maxDiscountAmount?: number;
  maxApplicableItems?: number;
}

export class DiscountLimit extends ValueObject<DiscountLimitProps> {
  private constructor(props: DiscountLimitProps) {
    super(props);
  }

  public static create(maxDiscountAmount?: number, maxApplicableItems?: number): DiscountLimit {
    if (maxDiscountAmount !== undefined && maxDiscountAmount < 0) {
      throw new Error('Maximum discount amount cannot be negative');
    }
    if (maxApplicableItems !== undefined && maxApplicableItems < 1) {
      throw new Error('Maximum applicable items must be at least 1');
    }
    return new DiscountLimit({ maxDiscountAmount, maxApplicableItems });
  }

  get maxDiscountAmount(): number | undefined {
    return this.props.maxDiscountAmount;
  }

  get maxApplicableItems(): number | undefined {
    return this.props.maxApplicableItems;
  }
}
