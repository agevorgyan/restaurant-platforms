import { ValueObject } from '@saas/core';

export interface AcceptedQuantityProps { amount: number; }

export class AcceptedQuantity extends ValueObject<AcceptedQuantityProps> {
  get amount(): number { return this.props.amount; }
  private constructor(props: AcceptedQuantityProps) { super(props); }
  public static create(amount: number): AcceptedQuantity {
    if (amount < 0) throw new Error('AcceptedQuantity cannot be negative');
    return new AcceptedQuantity({ amount });
  }
}