import { ValueObject } from '@saas/core';
import { RewardReference } from './reward-reference.value-object';
import { RuleReason } from './rule-reason.value-object';

export interface RewardEligibilityProps {
  eligibleRewards: RewardReference[];
  reasons: RuleReason[];
}

export class RewardEligibility extends ValueObject<RewardEligibilityProps> {
  get eligibleRewards(): RewardReference[] { return this.props.eligibleRewards; }
  get reasons(): RuleReason[] { return this.props.reasons; }
  private constructor(props: RewardEligibilityProps) { super(props); }
  public static create(props: RewardEligibilityProps): RewardEligibility {
    return new RewardEligibility(props);
  }
}