import { ValueObject } from '@saas/core';

export interface BusinessDateProps { date: Date; }
export class BusinessDate extends ValueObject<BusinessDateProps> {
  get date(): Date { return this.props.date; }
  private constructor(props: BusinessDateProps) { super(props); }
  public static create(date: Date): BusinessDate { return new BusinessDate({ date }); }
}