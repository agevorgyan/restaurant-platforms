import { ValueObject } from '@saas/core';

export interface ReservationDurationProps { minutes: number; }
export class ReservationDuration extends ValueObject<ReservationDurationProps> {
  get minutes(): number { return this.props.minutes; }
  private constructor(props: ReservationDurationProps) { super(props); }
  public static create(minutes: number): ReservationDuration { return new ReservationDuration({ minutes }); }
}