import { ValueObject } from '@saas/core';

export interface ReservationCorrelationIdProps { id: string; }
export class ReservationCorrelationId extends ValueObject<ReservationCorrelationIdProps> {
  get id(): string { return this.props.id; }
  private constructor(props: ReservationCorrelationIdProps) { super(props); }
  public static create(id?: string): ReservationCorrelationId { return new ReservationCorrelationId({ id: id || crypto.randomUUID() }); }
}