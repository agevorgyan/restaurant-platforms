import { ValueObject } from '@saas/core';
import { ReservationPriorityEnum } from '../enums/reservation.enum';

export interface ReservationPriorityProps { priority: ReservationPriorityEnum; }
export class ReservationPriority extends ValueObject<ReservationPriorityProps> {
  get priority(): ReservationPriorityEnum { return this.props.priority; }
  private constructor(props: ReservationPriorityProps) { super(props); }
  public static create(priority: ReservationPriorityEnum): ReservationPriority { return new ReservationPriority({ priority }); }
}