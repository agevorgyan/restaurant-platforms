import { ValueObject } from '@saas/core';
import { ReservationSourceEnum } from '../enums/reservation.enum';

export interface ReservationSourceProps { source: ReservationSourceEnum; }
export class ReservationSource extends ValueObject<ReservationSourceProps> {
  get source(): ReservationSourceEnum { return this.props.source; }
  private constructor(props: ReservationSourceProps) { super(props); }
  public static create(source: ReservationSourceEnum): ReservationSource { return new ReservationSource({ source }); }
}