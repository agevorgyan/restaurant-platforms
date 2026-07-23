import { ValueObject } from '@saas/core';

export interface ReservationCustomerCorrelationIdProps { id: string; }
export class ReservationCustomerCorrelationId extends ValueObject<ReservationCustomerCorrelationIdProps> {
  get id(): string { return this.props.id; }
  private constructor(props: ReservationCustomerCorrelationIdProps) { super(props); }
  public static create(id?: string): ReservationCustomerCorrelationId { return new ReservationCustomerCorrelationId({ id: id || crypto.randomUUID() }); }
}