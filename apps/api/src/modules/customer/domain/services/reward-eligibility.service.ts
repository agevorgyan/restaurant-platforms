import { LoyaltyEvaluationContext } from '../value-objects/loyalty-evaluation-context.value-object';
import { RewardEligibility } from '../value-objects/reward-eligibility.value-object';

export class RewardEligibilityService {
  public evaluate(context: LoyaltyEvaluationContext): RewardEligibility {
    void context;
    return RewardEligibility.create({
      eligibleRewards: [],
      reasons: []
    });
  }
}