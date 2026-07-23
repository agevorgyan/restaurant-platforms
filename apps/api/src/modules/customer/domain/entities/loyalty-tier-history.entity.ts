import { Entity } from '@saas/core';
import { LoyaltyTierVo } from '../value-objects/loyalty-tier.value-object';

export interface LoyaltyTierHistoryProps {
  previousTier: LoyaltyTierVo;
  newTier: LoyaltyTierVo;
  changedAt: Date;
  reason: string;
}

export class LoyaltyTierHistory extends Entity<LoyaltyTierHistoryProps> {
  private constructor(id: string, props: LoyaltyTierHistoryProps) { super(id, props); }
  public static create(id: string, props: LoyaltyTierHistoryProps): LoyaltyTierHistory {
    return new LoyaltyTierHistory(id, props);
  }
}