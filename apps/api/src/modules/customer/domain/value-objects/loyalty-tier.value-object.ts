import { ValueObject } from '@saas/core';
import { LoyaltyTier as LoyaltyTierEnum } from '../enums/loyalty.enums';

export interface LoyaltyTierVoProps { tier: LoyaltyTierEnum; }

export class LoyaltyTierVo extends ValueObject<LoyaltyTierVoProps> {
  get tier(): LoyaltyTierEnum { return this.props.tier; }
  private constructor(props: LoyaltyTierVoProps) { super(props); }
  public static create(tier: LoyaltyTierEnum): LoyaltyTierVo {
    return new LoyaltyTierVo({ tier });
  }
}