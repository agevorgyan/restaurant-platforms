import { Entity } from '@saas/core';
import { ReservationStatusEnum } from '../enums/reservation.enum';

export interface ReservationTimelineProps {
  status: ReservationStatusEnum;
  recordedAt: Date;
  reason?: string;
}

export class ReservationTimeline extends Entity<ReservationTimelineProps> {
  get status(): ReservationStatusEnum { return this.props.status; }
  get recordedAt(): Date { return this.props.recordedAt; }
  get reason(): string | undefined { return this.props.reason; }

  private constructor(id: string, props: ReservationTimelineProps) { super(id, props); }
  public static create(props: ReservationTimelineProps, id?: string): ReservationTimeline {
    return new ReservationTimeline(id || crypto.randomUUID(), props);
  }
}