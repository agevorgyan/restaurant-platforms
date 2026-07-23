import { ValueObject } from '@saas/core';

export interface ReservationReferenceProps { reference: string; }
export class ReservationReference extends ValueObject<ReservationReferenceProps> {
  get reference(): string { return this.props.reference; }
  private constructor(props: ReservationReferenceProps) { super(props); }
  public static create(reference: string): ReservationReference { return new ReservationReference({ reference }); }
}