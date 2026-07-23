import { LoyaltyEvaluationContext } from '../value-objects/loyalty-evaluation-context.value-object';
import { TierDecision } from '../value-objects/tier-decision.value-object';

export class TierEvaluationService {
  public evaluate(context: LoyaltyEvaluationContext): TierDecision {
    return TierDecision.create({
      tier: context.currentTier,
      isUpgraded: false,
      reasons: []
    });
  }
}