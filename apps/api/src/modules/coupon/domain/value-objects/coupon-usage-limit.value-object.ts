import { ValueObject } from '@saas/core';

export interface CouponUsageLimitProps {
  maxTotalUses?: number;
  maxUsesPerCustomer?: number;
}

export class CouponUsageLimit extends ValueObject<CouponUsageLimitProps> {
  private constructor(props: CouponUsageLimitProps) {
    super(props);
  }

  public static create(maxTotalUses?: number, maxUsesPerCustomer?: number): CouponUsageLimit {
    if (maxTotalUses !== undefined && maxTotalUses < 1) {
      throw new Error('Total uses limit must be at least 1');
    }
    if (maxUsesPerCustomer !== undefined && maxUsesPerCustomer < 1) {
      throw new Error('Uses per customer limit must be at least 1');
    }
    return new CouponUsageLimit({ maxTotalUses, maxUsesPerCustomer });
  }

  get maxTotalUses(): number | undefined {
    return this.props.maxTotalUses;
  }

  get maxUsesPerCustomer(): number | undefined {
    return this.props.maxUsesPerCustomer;
  }
}
