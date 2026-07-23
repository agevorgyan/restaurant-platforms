import { ValueObject } from '@saas/core';

export interface ReceiptDateProps { date: Date; }

export class ReceiptDate extends ValueObject<ReceiptDateProps> {
  get date(): Date { return this.props.date; }
  private constructor(props: ReceiptDateProps) { super(props); }
  public static create(date: Date): ReceiptDate {
    if (date > new Date()) throw new Error('Receipt date cannot be in the future');
    return new ReceiptDate({ date });
  }
}