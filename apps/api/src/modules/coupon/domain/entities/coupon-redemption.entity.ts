import { Entity } from '@saas/core';

export interface CouponRedemptionProps {
  couponId: string;
  customerId: string;
  orderId: string;
  redeemedAt: Date;
  discountAmount?: number;
}

export class CouponRedemption extends Entity<CouponRedemptionProps> {
  private constructor(id: string, props: CouponRedemptionProps) {
    super(id, props);
  }

  public static create(
    id: string,
    couponId: string,
    customerId: string,
    orderId: string,
    discountAmount?: number,
    redeemedAt: Date = new Date()
  ): CouponRedemption {
    if (!couponId) throw new Error('CouponId is required for redemption');
    if (!customerId) throw new Error('CustomerId is required for redemption');
    if (!orderId) throw new Error('OrderId is required for redemption');

    return new CouponRedemption(id, {
      couponId,
      customerId,
      orderId,
      redeemedAt,
      discountAmount,
    });
  }

  get couponId(): string {
    return this.props.couponId;
  }

  get customerId(): string {
    return this.props.customerId;
  }

  get orderId(): string {
    return this.props.orderId;
  }

  get redeemedAt(): Date {
    return this.props.redeemedAt;
  }

  get discountAmount(): number | undefined {
    return this.props.discountAmount;
  }
}
