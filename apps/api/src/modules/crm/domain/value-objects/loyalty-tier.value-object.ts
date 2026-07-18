export type LoyaltyTierValue = 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Custom';

export class LoyaltyTier {
  constructor(public readonly value: LoyaltyTierValue) {
    const validTiers = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Custom'];
    if (!validTiers.includes(value)) {
      throw new Error(`Invalid loyalty tier: ${value}`);
    }
  }
}
