import { ValueObject } from '@saas/core';

export interface ReservationCodeProps { code: string; }
export class ReservationCode extends ValueObject<ReservationCodeProps> {
  get code(): string { return this.props.code; }
  private constructor(props: ReservationCodeProps) { super(props); }
  public static create(code: string): ReservationCode { return new ReservationCode({ code }); }
}