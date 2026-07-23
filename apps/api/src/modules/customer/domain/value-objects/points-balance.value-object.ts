import { ValueObject } from '@saas/core';

export interface PointsBalanceProps { amount: number; }

export class PointsBalance extends ValueObject<PointsBalanceProps> {
  get amount(): number { return this.props.amount; }
  private constructor(props: PointsBalanceProps) { super(props); }
  public static create(amount: number): PointsBalance {
    if (amount < 0) throw new Error('Points balance cannot be negative');
    return new PointsBalance({ amount });
  }
}