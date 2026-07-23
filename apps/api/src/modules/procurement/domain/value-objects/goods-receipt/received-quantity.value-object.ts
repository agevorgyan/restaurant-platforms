import { ValueObject } from '@saas/core';

export interface ReceivedQuantityProps { amount: number; }

export class ReceivedQuantity extends ValueObject<ReceivedQuantityProps> {
  get amount(): number { return this.props.amount; }
  private constructor(props: ReceivedQuantityProps) { super(props); }
  public static create(amount: number): ReceivedQuantity {
    if (amount < 0) throw new Error('ReceivedQuantity cannot be negative');
    return new ReceivedQuantity({ amount });
  }
}