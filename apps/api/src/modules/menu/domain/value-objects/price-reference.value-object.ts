import { ValueObject } from '@saas/core';

export interface PriceReferenceProps { priceId: string; }

export class PriceReference extends ValueObject<PriceReferenceProps> {
  get priceId(): string { return this.props.priceId; }
  private constructor(props: PriceReferenceProps) { super(props); }
  public static create(priceId: string): PriceReference {
    if (!priceId) throw new Error('PriceReference cannot be empty');
    return new PriceReference({ priceId });
  }
}