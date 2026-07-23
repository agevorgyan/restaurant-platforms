import { ValueObject } from '@saas/core';

export interface ExpirationDateProps { date: Date; }

export class ExpirationDate extends ValueObject<ExpirationDateProps> {
  get date(): Date { return this.props.date; }
  private constructor(props: ExpirationDateProps) { super(props); }
  public static create(date: Date): ExpirationDate {
    return new ExpirationDate({ date });
  }
}