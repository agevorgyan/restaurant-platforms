import { ValueObject } from '@saas/core';

export interface VisibilityPeriodProps {
  startDate: Date;
  endDate?: Date;
}

export class VisibilityPeriod extends ValueObject<VisibilityPeriodProps> {
  get startDate(): Date { return this.props.startDate; }
  get endDate(): Date | undefined { return this.props.endDate; }

  private constructor(props: VisibilityPeriodProps) { super(props); }

  public static create(startDate: Date, endDate?: Date): VisibilityPeriod {
    if (endDate && startDate >= endDate) {
      throw new Error('StartDate must be before EndDate');
    }
    return new VisibilityPeriod({ startDate, endDate });
  }
}