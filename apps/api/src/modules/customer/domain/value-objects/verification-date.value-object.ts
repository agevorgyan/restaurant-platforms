import { ValueObject } from '@saas/core';

export interface VerificationDateProps { date: Date; }

export class VerificationDate extends ValueObject<VerificationDateProps> {
  get date(): Date { return this.props.date; }
  private constructor(props: VerificationDateProps) { super(props); }
  public static create(date: Date): VerificationDate {
    return new VerificationDate({ date });
  }
}