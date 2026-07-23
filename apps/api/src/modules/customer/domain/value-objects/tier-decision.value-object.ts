import { ValueObject } from '@saas/core';
import { LoyaltyTierVo } from './loyalty-tier.value-object';
import { RuleReason } from './rule-reason.value-object';

export interface TierDecisionProps {
  tier: LoyaltyTierVo;
  isUpgraded: boolean;
  reasons: RuleReason[];
}

export class TierDecision extends ValueObject<TierDecisionProps> {
  get tier(): LoyaltyTierVo { return this.props.tier; }
  get isUpgraded(): boolean { return this.props.isUpgraded; }
  get reasons(): RuleReason[] { return this.props.reasons; }
  private constructor(props: TierDecisionProps) { super(props); }
  public static create(props: TierDecisionProps): TierDecision {
    return new TierDecision(props);
  }
}