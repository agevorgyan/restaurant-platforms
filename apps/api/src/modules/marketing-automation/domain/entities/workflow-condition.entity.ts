import { Entity } from '@saas/core';

export interface WorkflowConditionProps {
  customerSegments?: string[];
  loyaltyTiers?: string[];
  restaurantIds?: string[];
  branchIds?: string[];
  countries?: string[];
  cities?: string[];
  languages?: string[];
  minOrderAmount?: number;
  maxOrderAmount?: number;
  minOrderCount?: number;
  daysSinceLastOrder?: number;
  daysSinceRegistration?: number;
  productPurchasedIds?: string[];
  menuCategoryIds?: string[];
  timeWindowStart?: string; // HH:mm
  timeWindowEnd?: string; // HH:mm
  weekdays?: number[]; // 0-6
  isHappyHour?: boolean;
}

export class WorkflowCondition extends Entity<WorkflowConditionProps> {
  private constructor(id: string, props: WorkflowConditionProps) {
    super(id, props);
  }

  public static create(id: string, props: WorkflowConditionProps): WorkflowCondition {
    if (props.minOrderAmount !== undefined && props.minOrderAmount < 0) {
      throw new Error('Minimum order amount cannot be negative');
    }
    return new WorkflowCondition(id, props);
  }

  public evaluate(context: any): boolean {
    // A simplistic evaluation structure acting on context matching conditions
    if (this.props.customerSegments?.length) {
      if (!context.customerSegment || !this.props.customerSegments.includes(context.customerSegment)) return false;
    }

    if (this.props.minOrderAmount !== undefined) {
      if (context.orderAmount === undefined || context.orderAmount < this.props.minOrderAmount) return false;
    }

    if (this.props.productPurchasedIds?.length) {
      if (!context.purchasedProducts || !context.purchasedProducts.some((p: string) => this.props.productPurchasedIds!.includes(p))) return false;
    }
    
    // Extend with further validations for business requirements
    return true;
  }
}
