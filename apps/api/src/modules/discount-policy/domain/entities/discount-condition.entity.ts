import { Entity } from '@saas/core';

export interface DiscountConditionProps {
  minOrderAmount?: number;
  maxOrderAmount?: number;
  minQuantity?: number;
  productIds?: string[];
  categoryIds?: string[];
  restaurantIds?: string[];
  branchIds?: string[];
  customerSegments?: string[];
  loyaltyTiers?: string[];
  timeWindowStart?: string; // HH:mm format
  timeWindowEnd?: string; // HH:mm format
  weekdays?: number[]; // 0-6
  firstOrderOnly?: boolean;
  referralRequired?: boolean;
  birthdayOnly?: boolean;
}

export class DiscountCondition extends Entity<DiscountConditionProps> {
  private constructor(id: string, props: DiscountConditionProps) {
    super(id, props);
  }

  public static create(id: string, props: DiscountConditionProps): DiscountCondition {
    if (props.minOrderAmount !== undefined && props.minOrderAmount < 0) {
      throw new Error('Minimum order amount cannot be negative');
    }
    if (props.maxOrderAmount !== undefined && props.maxOrderAmount < 0) {
      throw new Error('Maximum order amount cannot be negative');
    }
    if (props.minOrderAmount !== undefined && props.maxOrderAmount !== undefined) {
      if (props.minOrderAmount > props.maxOrderAmount) {
        throw new Error('Minimum order amount cannot be greater than maximum order amount');
      }
    }
    
    return new DiscountCondition(id, props);
  }

  // A method to evaluate if this condition is satisfied by a given context
  public isSatisfiedBy(context: {
    orderAmount?: number;
    orderItemQuantities?: number;
    productIds?: string[];
    categoryIds?: string[];
    restaurantId?: string;
    branchId?: string;
    customerSegment?: string;
    loyaltyTier?: string;
    orderDate?: Date;
    isFirstOrder?: boolean;
    hasReferral?: boolean;
    isBirthday?: boolean;
  }): boolean {
    if (this.props.minOrderAmount !== undefined) {
      if (context.orderAmount === undefined || context.orderAmount < this.props.minOrderAmount) return false;
    }

    if (this.props.maxOrderAmount !== undefined) {
      if (context.orderAmount === undefined || context.orderAmount > this.props.maxOrderAmount) return false;
    }

    if (this.props.minQuantity !== undefined) {
      if (context.orderItemQuantities === undefined || context.orderItemQuantities < this.props.minQuantity) return false;
    }

    if (this.props.productIds && this.props.productIds.length > 0) {
      if (!context.productIds || !context.productIds.some(p => this.props.productIds!.includes(p))) return false;
    }

    if (this.props.categoryIds && this.props.categoryIds.length > 0) {
      if (!context.categoryIds || !context.categoryIds.some(c => this.props.categoryIds!.includes(c))) return false;
    }

    if (this.props.restaurantIds && this.props.restaurantIds.length > 0) {
      if (!context.restaurantId || !this.props.restaurantIds.includes(context.restaurantId)) return false;
    }

    if (this.props.branchIds && this.props.branchIds.length > 0) {
      if (!context.branchId || !this.props.branchIds.includes(context.branchId)) return false;
    }

    if (this.props.customerSegments && this.props.customerSegments.length > 0) {
      if (!context.customerSegment || !this.props.customerSegments.includes(context.customerSegment)) return false;
    }

    if (this.props.loyaltyTiers && this.props.loyaltyTiers.length > 0) {
      if (!context.loyaltyTier || !this.props.loyaltyTiers.includes(context.loyaltyTier)) return false;
    }

    if (this.props.firstOrderOnly) {
      if (!context.isFirstOrder) return false;
    }

    if (this.props.referralRequired) {
      if (!context.hasReferral) return false;
    }

    if (this.props.birthdayOnly) {
      if (!context.isBirthday) return false;
    }

    // Time window logic could be complex (timezone), using simple hour checks for demonstration
    if (this.props.timeWindowStart && this.props.timeWindowEnd && context.orderDate) {
      const hours = context.orderDate.getHours().toString().padStart(2, '0');
      const minutes = context.orderDate.getMinutes().toString().padStart(2, '0');
      const timeStr = `${hours}:${minutes}`;
      
      if (timeStr < this.props.timeWindowStart || timeStr > this.props.timeWindowEnd) return false;
    }

    if (this.props.weekdays && this.props.weekdays.length > 0 && context.orderDate) {
      if (!this.props.weekdays.includes(context.orderDate.getDay())) return false;
    }

    return true;
  }
}
