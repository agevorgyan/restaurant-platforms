import { ValueObject } from '@saas/core';

export interface ReservationIdProps { value: string; }
export class ReservationId extends ValueObject<ReservationIdProps> {
  get value(): string { return this.props.value; }
  private constructor(props: ReservationIdProps) { super(props); }
  public static create(value?: string): ReservationId { return new ReservationId({ value: value || crypto.randomUUID() }); }
}