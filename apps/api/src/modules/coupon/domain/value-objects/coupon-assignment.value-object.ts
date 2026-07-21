import { ValueObject } from '@saas/core';

export interface CouponAssignmentProps {
  campaignId?: string;
  promotionId: string;
}

export class CouponAssignment extends ValueObject<CouponAssignmentProps> {
  private constructor(props: CouponAssignmentProps) {
    super(props);
  }

  public static create(promotionId: string, campaignId?: string): CouponAssignment {
    if (!promotionId || promotionId.trim().length === 0) {
      throw new Error('A coupon must be assigned to a promotion');
    }
    return new CouponAssignment({ promotionId, campaignId });
  }

  get promotionId(): string {
    return this.props.promotionId;
  }

  get campaignId(): string | undefined {
    return this.props.campaignId;
  }
}
