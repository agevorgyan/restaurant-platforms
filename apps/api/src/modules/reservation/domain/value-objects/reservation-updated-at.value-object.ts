import { ValueObject } from '@saas/core';

export interface ReservationUpdatedAtProps { updatedAt: Date; }
export class ReservationUpdatedAt extends ValueObject<ReservationUpdatedAtProps> {
  get updatedAt(): Date { return this.props.updatedAt; }
  private constructor(props: ReservationUpdatedAtProps) { super(props); }
  public static create(updatedAt: Date): ReservationUpdatedAt { return new ReservationUpdatedAt({ updatedAt }); }
}