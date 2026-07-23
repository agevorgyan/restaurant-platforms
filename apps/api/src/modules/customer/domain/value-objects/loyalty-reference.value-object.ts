import { ValueObject } from '@saas/core';

export interface LoyaltyReferenceProps { loyaltyAccountId: string; }

export class LoyaltyReference extends ValueObject<LoyaltyReferenceProps> {
  get loyaltyAccountId(): string { return this.props.loyaltyAccountId; }
  private constructor(props: LoyaltyReferenceProps) { super(props); }
  public static create(loyaltyAccountId: string): LoyaltyReference {
    if (!loyaltyAccountId) throw new Error('LoyaltyReference cannot be empty');
    return new LoyaltyReference({ loyaltyAccountId });
  }
}