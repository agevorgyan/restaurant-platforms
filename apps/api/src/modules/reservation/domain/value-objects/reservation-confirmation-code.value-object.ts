import { ValueObject } from '@saas/core';

export interface ReservationConfirmationCodeProps { code: string; }
export class ReservationConfirmationCode extends ValueObject<ReservationConfirmationCodeProps> {
  get code(): string { return this.props.code; }
  private constructor(props: ReservationConfirmationCodeProps) { super(props); }
  public static create(code: string): ReservationConfirmationCode { return new ReservationConfirmationCode({ code }); }
}