import { ValueObject } from '@saas/core';

export interface ExpectedDeliveryDateProps { date: Date; }

export class ExpectedDeliveryDate extends ValueObject<ExpectedDeliveryDateProps> {
  get date(): Date { return this.props.date; }
  private constructor(props: ExpectedDeliveryDateProps) { super(props); }
  public static create(date: Date): ExpectedDeliveryDate {
    if (date < new Date(new Date().setHours(0,0,0,0))) throw new Error('Expected delivery date cannot be in the past');
    return new ExpectedDeliveryDate({ date });
  }
}