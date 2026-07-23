import { Entity } from '@saas/core';
import { RewardReference } from '../value-objects/reward-reference.value-object';
import { PointsAmount } from '../value-objects/points-amount.value-object';

export interface LoyaltyRewardProps {
  rewardRef: RewardReference;
  cost: PointsAmount;
  redeemedAt: Date;
}

export class LoyaltyReward extends Entity<LoyaltyRewardProps> {
  private constructor(id: string, props: LoyaltyRewardProps) { super(id, props); }
  public static create(id: string, props: LoyaltyRewardProps): LoyaltyReward {
    return new LoyaltyReward(id, props);
  }
}