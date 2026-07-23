import { ValueObject } from '@saas/core';

export interface ReservationTimeProps { time: string; }
export class ReservationTime extends ValueObject<ReservationTimeProps> {
  get time(): string { return this.props.time; }
  private constructor(props: ReservationTimeProps) { super(props); }
  public static create(time: string): ReservationTime { return new ReservationTime({ time }); }
}