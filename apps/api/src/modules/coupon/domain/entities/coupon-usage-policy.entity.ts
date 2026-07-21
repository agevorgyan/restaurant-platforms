import { Entity } from '@saas/core';

export interface CouponUsagePolicyProps {
  customerSegments?: string[];
  loyaltyTiers?: string[];
  restaurantIds?: string[];
  branchIds?: string[];
  minOrderAmount?: number;
  productIds?: string[];
  menuCategoryIds?: string[];
  firstOrderOnly?: boolean;
}

export class CouponUsagePolicy extends Entity<CouponUsagePolicyProps> {
  private constructor(id: string, props: CouponUsagePolicyProps) {
    super(id, props);
  }

  public static create(id: string, props: CouponUsagePolicyProps): CouponUsagePolicy {
    if (props.minOrderAmount !== undefined && props.minOrderAmount < 0) {
      throw new Error('Minimum order amount cannot be negative');
    }
    return new CouponUsagePolicy(id, props);
  }

  public isSatisfiedBy(context: {
    customerSegment?: string;
    loyaltyTier?: string;
    restaurantId?: string;
    branchId?: string;
    orderAmount?: number;
    productIds?: string[];
    isFirstOrder?: boolean;
  }): boolean {
    if (this.props.customerSegments && this.props.customerSegments.length > 0) {
      if (!context.customerSegment || !this.props.customerSegments.includes(context.customerSegment)) {
        return false;
      }
    }

    if (this.props.loyaltyTiers && this.props.loyaltyTiers.length > 0) {
      if (!context.loyaltyTier || !this.props.loyaltyTiers.includes(context.loyaltyTier)) {
        return false;
      }
    }

    if (this.props.restaurantIds && this.props.restaurantIds.length > 0) {
      if (!context.restaurantId || !this.props.restaurantIds.includes(context.restaurantId)) {
        return false;
      }
    }

    if (this.props.branchIds && this.props.branchIds.length > 0) {
      if (!context.branchId || !this.props.branchIds.includes(context.branchId)) {
        return false;
      }
    }

    if (this.props.minOrderAmount !== undefined) {
      if (context.orderAmount === undefined || context.orderAmount < this.props.minOrderAmount) {
        return false;
      }
    }

    if (this.props.productIds && this.props.productIds.length > 0) {
      if (!context.productIds || !context.productIds.some(p => this.props.productIds!.includes(p))) {
        return false;
      }
    }

    if (this.props.firstOrderOnly) {
      if (!context.isFirstOrder) {
        return false;
      }
    }

    return true;
  }
}
