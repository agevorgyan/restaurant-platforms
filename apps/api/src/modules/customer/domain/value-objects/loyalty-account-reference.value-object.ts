import { ValueObject } from '@saas/core';

export interface LoyaltyAccountReferenceProps { loyaltyId: string; }

export class LoyaltyAccountReference extends ValueObject<LoyaltyAccountReferenceProps> {
  get loyaltyId(): string { return this.props.loyaltyId; }
  private constructor(props: LoyaltyAccountReferenceProps) { super(props); }
  public static create(loyaltyId: string): LoyaltyAccountReference {
    return new LoyaltyAccountReference({ loyaltyId });
  }
}