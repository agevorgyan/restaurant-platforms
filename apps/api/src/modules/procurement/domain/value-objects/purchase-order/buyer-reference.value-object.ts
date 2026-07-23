import { ValueObject } from '@saas/core';

export interface BuyerReferenceProps { buyerId: string; }

export class BuyerReference extends ValueObject<BuyerReferenceProps> {
  get buyerId(): string { return this.props.buyerId; }
  private constructor(props: BuyerReferenceProps) { super(props); }
  public static create(buyerId: string): BuyerReference {
    if (!buyerId) throw new Error('BuyerReference cannot be empty');
    return new BuyerReference({ buyerId });
  }
}