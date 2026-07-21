import { ValueObject } from '@saas/core';

export interface CouponRedemptionLimitProps {
  currentTotalUses: number;
}

export class CouponRedemptionLimit extends ValueObject<CouponRedemptionLimitProps> {
  private constructor(props: CouponRedemptionLimitProps) {
    super(props);
  }

  public static initial(): CouponRedemptionLimit {
    return new CouponRedemptionLimit({ currentTotalUses: 0 });
  }

  public static create(currentTotalUses: number): CouponRedemptionLimit {
    if (currentTotalUses < 0) {
      throw new Error('Current total uses cannot be negative');
    }
    return new CouponRedemptionLimit({ currentTotalUses });
  }

  get currentTotalUses(): number {
    return this.props.currentTotalUses;
  }

  public increment(): CouponRedemptionLimit {
    return new CouponRedemptionLimit({
      currentTotalUses: this.props.currentTotalUses + 1,
    });
  }

  public hasReachedLimit(maxUses?: number): boolean {
    if (maxUses === undefined) return false;
    return this.props.currentTotalUses >= maxUses;
  }
}
