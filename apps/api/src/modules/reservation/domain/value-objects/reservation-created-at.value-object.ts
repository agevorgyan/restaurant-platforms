import { ValueObject } from '@saas/core';

export interface ReservationCreatedAtProps { createdAt: Date; }
export class ReservationCreatedAt extends ValueObject<ReservationCreatedAtProps> {
  get createdAt(): Date { return this.props.createdAt; }
  private constructor(props: ReservationCreatedAtProps) { super(props); }
  public static create(createdAt: Date): ReservationCreatedAt { return new ReservationCreatedAt({ createdAt }); }
}