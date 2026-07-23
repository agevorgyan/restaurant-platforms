import { ValueObject } from '@saas/core';
import { ReservationTypeEnum } from '../enums/reservation.enum';

export interface ReservationTypeProps { type: ReservationTypeEnum; }
export class ReservationType extends ValueObject<ReservationTypeProps> {
  get type(): ReservationTypeEnum { return this.props.type; }
  private constructor(props: ReservationTypeProps) { super(props); }
  public static create(type: ReservationTypeEnum): ReservationType { return new ReservationType({ type }); }
}