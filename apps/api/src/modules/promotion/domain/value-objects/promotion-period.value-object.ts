import { ValueObject } from '@saas/core';

interface PromotionPeriodProps {
  startDate: Date;
  endDate: Date;
}

export class PromotionPeriod extends ValueObject<PromotionPeriodProps> {
  private constructor(props: PromotionPeriodProps) {
    super(props);
  }

  public get startDate(): Date {
    return this.props.startDate;
  }

  public get endDate(): Date {
    return this.props.endDate;
  }

  public static create(startDate: Date, endDate: Date): PromotionPeriod {
    if (endDate < startDate) {
      throw new Error('Validity end date must not be before start date');
    }
    return new PromotionPeriod({ startDate, endDate });
  }

  public isActive(date: Date = new Date()): boolean {
    return date >= this.startDate && date <= this.endDate;
  }
}
