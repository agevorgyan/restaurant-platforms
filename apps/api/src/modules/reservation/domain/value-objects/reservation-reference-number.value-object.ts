import { ValueObject } from '@saas/core';

export interface ReservationReferenceNumberProps { referenceNumber: string; }
export class ReservationReferenceNumber extends ValueObject<ReservationReferenceNumberProps> {
  get referenceNumber(): string { return this.props.referenceNumber; }
  private constructor(props: ReservationReferenceNumberProps) { super(props); }
  public static create(referenceNumber: string): ReservationReferenceNumber { return new ReservationReferenceNumber({ referenceNumber }); }
}