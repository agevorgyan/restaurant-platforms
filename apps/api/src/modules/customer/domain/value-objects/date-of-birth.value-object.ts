import { ValueObject } from '@saas/core';

export interface DateOfBirthProps { date: Date; }

export class DateOfBirth extends ValueObject<DateOfBirthProps> {
  get date(): Date { return this.props.date; }
  private constructor(props: DateOfBirthProps) { super(props); }
  public static create(date: Date): DateOfBirth {
    return new DateOfBirth({ date });
  }
}