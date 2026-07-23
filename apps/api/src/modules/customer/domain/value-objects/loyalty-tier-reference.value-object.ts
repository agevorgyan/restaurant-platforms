import { ValueObject } from '@saas/core';
import { LoyaltyTier } from '../enums/loyalty.enums';

export interface LoyaltyTierReferenceProps { tier: LoyaltyTier; }

export class LoyaltyTierReference extends ValueObject<LoyaltyTierReferenceProps> {
  get tier(): LoyaltyTier { return this.props.tier; }
  private constructor(props: LoyaltyTierReferenceProps) { super(props); }
  public static create(tier: LoyaltyTier): LoyaltyTierReference {
    return new LoyaltyTierReference({ tier });
  }
}