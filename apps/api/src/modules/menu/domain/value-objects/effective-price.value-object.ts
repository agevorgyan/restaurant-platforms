import { ValueObject } from '@saas/core';

export interface EffectivePriceProps { amount: number; }

export class EffectivePrice extends ValueObject<EffectivePriceProps> {
  get amount(): number { return this.props.amount; }
  private constructor(props: EffectivePriceProps) { super(props); }
  public static create(amount: number): EffectivePrice {
    if (amount < 0) throw new Error('Effective price cannot be negative');
    return new EffectivePrice({ amount });
  }
}