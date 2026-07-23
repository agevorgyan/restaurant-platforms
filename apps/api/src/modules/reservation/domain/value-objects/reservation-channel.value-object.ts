import { ValueObject } from '@saas/core';
import { ReservationChannelEnum } from '../enums/reservation.enum';

export interface ReservationChannelProps { channel: ReservationChannelEnum; }
export class ReservationChannel extends ValueObject<ReservationChannelProps> {
  get channel(): ReservationChannelEnum { return this.props.channel; }
  private constructor(props: ReservationChannelProps) { super(props); }
  public static create(channel: ReservationChannelEnum): ReservationChannel { return new ReservationChannel({ channel }); }
}