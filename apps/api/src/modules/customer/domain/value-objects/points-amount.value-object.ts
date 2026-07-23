import { ValueObject } from '@saas/core';

export interface PointsAmountProps { value: number; }

export class PointsAmount extends ValueObject<PointsAmountProps> {
  get value(): number { return this.props.value; }
  private constructor(props: PointsAmountProps) { super(props); }
  public static create(value: number): PointsAmount {
    return new PointsAmount({ value });
  }
}