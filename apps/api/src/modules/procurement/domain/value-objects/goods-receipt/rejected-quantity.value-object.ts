import { ValueObject } from '@saas/core';

export interface RejectedQuantityProps { amount: number; }

export class RejectedQuantity extends ValueObject<RejectedQuantityProps> {
  get amount(): number { return this.props.amount; }
  private constructor(props: RejectedQuantityProps) { super(props); }
  public static create(amount: number): RejectedQuantity {
    if (amount < 0) throw new Error('RejectedQuantity cannot be negative');
    return new RejectedQuantity({ amount });
  }
}