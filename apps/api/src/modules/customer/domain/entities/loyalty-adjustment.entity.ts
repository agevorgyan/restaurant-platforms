import { Entity } from '@saas/core';
import { PointsAmount } from '../value-objects/points-amount.value-object';
import { PointsReason } from '../value-objects/points-reason.value-object';

export interface LoyaltyAdjustmentProps {
  amount: PointsAmount;
  reason: PointsReason;
  adjustedBy: string;
  adjustedAt: Date;
}

export class LoyaltyAdjustment extends Entity<LoyaltyAdjustmentProps> {
  private constructor(id: string, props: LoyaltyAdjustmentProps) { super(id, props); }
  public static create(id: string, props: LoyaltyAdjustmentProps): LoyaltyAdjustment {
    return new LoyaltyAdjustment(id, props);
  }
}