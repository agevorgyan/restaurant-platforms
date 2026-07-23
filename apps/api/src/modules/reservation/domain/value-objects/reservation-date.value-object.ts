import { ValueObject } from '@saas/core';

export interface ReservationDateProps { date: Date; }
export class ReservationDate extends ValueObject<ReservationDateProps> {
  get date(): Date { return this.props.date; }
  private constructor(props: ReservationDateProps) { super(props); }
  public static create(date: Date): ReservationDate { return new ReservationDate({ date }); }
}