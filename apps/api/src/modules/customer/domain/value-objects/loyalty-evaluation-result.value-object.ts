import { ValueObject } from '@saas/core';
import { LoyaltyTierVo } from './loyalty-tier.value-object';
import { RuleReason } from './rule-reason.value-object';
import { PointsAmount } from './points-amount.value-object';
import { RewardReference } from './reward-reference.value-object';

export interface LoyaltyEvaluationResultProps {
  approved: boolean;
  rejected: boolean;
  pointsToEarn: PointsAmount;
  pointsToRedeem: PointsAmount;
  newTier?: LoyaltyTierVo;
  eligibleRewards: RewardReference[];
  expirationImpact: PointsAmount;
  reasons: RuleReason[];
}

export class LoyaltyEvaluationResult extends ValueObject<LoyaltyEvaluationResultProps> {
  get approved(): boolean { return this.props.approved; }
  get rejected(): boolean { return this.props.rejected; }
  get pointsToEarn(): PointsAmount { return this.props.pointsToEarn; }
  get pointsToRedeem(): PointsAmount { return this.props.pointsToRedeem; }
  get newTier(): LoyaltyTierVo | undefined { return this.props.newTier; }
  get eligibleRewards(): RewardReference[] { return this.props.eligibleRewards; }
  get expirationImpact(): PointsAmount { return this.props.expirationImpact; }
  get reasons(): RuleReason[] { return this.props.reasons; }

  private constructor(props: LoyaltyEvaluationResultProps) { super(props); }
  public static create(props: LoyaltyEvaluationResultProps): LoyaltyEvaluationResult {
    return new LoyaltyEvaluationResult(props);
  }
}