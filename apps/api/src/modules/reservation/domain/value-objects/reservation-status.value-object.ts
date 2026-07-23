import { ValueObject } from '@saas/core';
import { ReservationStatusEnum } from '../enums/reservation.enum';

export interface ReservationStatusProps { status: ReservationStatusEnum; }
export class ReservationStatus extends ValueObject<ReservationStatusProps> {
  get status(): ReservationStatusEnum { return this.props.status; }
  private constructor(props: ReservationStatusProps) { super(props); }
  public static create(status: ReservationStatusEnum): ReservationStatus { return new ReservationStatus({ status }); }
}