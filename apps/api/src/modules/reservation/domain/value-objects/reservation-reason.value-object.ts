import { ValueObject } from '@saas/core';

export interface ReservationReasonProps { reason: string; }
export class ReservationReason extends ValueObject<ReservationReasonProps> {
  get reason(): string { return this.props.reason; }
  private constructor(props: ReservationReasonProps) { super(props); }
  public static create(reason: string): ReservationReason { return new ReservationReason({ reason }); }
}