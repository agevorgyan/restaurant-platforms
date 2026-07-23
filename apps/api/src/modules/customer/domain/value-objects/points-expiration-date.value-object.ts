import { ValueObject } from '@saas/core';

export interface PointsExpirationDateProps { date: Date; }

export class PointsExpirationDate extends ValueObject<PointsExpirationDateProps> {
  get date(): Date { return this.props.date; }
  private constructor(props: PointsExpirationDateProps) { super(props); }
  public static create(date: Date): PointsExpirationDate {
    if (date.getTime() < new Date().getTime()) {
      throw new Error('Expiration date must be in the future');
    }
    return new PointsExpirationDate({ date });
  }
}