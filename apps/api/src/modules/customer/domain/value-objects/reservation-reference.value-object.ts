import { ValueObject } from '@saas/core';

export interface ReservationReferenceProps { reservationId: string; }

export class ReservationReference extends ValueObject<ReservationReferenceProps> {
  get reservationId(): string { return this.props.reservationId; }
  private constructor(props: ReservationReferenceProps) { super(props); }
  public static create(reservationId: string): ReservationReference {
    return new ReservationReference({ reservationId });
  }
}