import { ValueObject } from '@saas/core';

export interface ReservationCorrelationIdProps { correlationId: string; }
export class ReservationCorrelationId extends ValueObject<ReservationCorrelationIdProps> {
  get correlationId(): string { return this.props.correlationId; }
  private constructor(props: ReservationCorrelationIdProps) { super(props); }
  public static create(correlationId: string): ReservationCorrelationId { return new ReservationCorrelationId({ correlationId }); }
}