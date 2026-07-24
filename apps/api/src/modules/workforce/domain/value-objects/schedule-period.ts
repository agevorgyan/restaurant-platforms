import { DomainPrimitive } from '@saas/domain';

export interface SchedulePeriodProps {
  startDate: Date;
  endDate: Date;
}

export class SchedulePeriod extends DomainPrimitive<SchedulePeriodProps> {
  private constructor(value: SchedulePeriodProps) {
    super(value);
  }

  public static create(startDate: Date, endDate: Date): SchedulePeriod {
    if (startDate >= endDate) {
      throw new Error('Schedule period start date must be before end date.');
    }
    return new SchedulePeriod({ startDate, endDate });
  }

  public contains(date: Date): boolean {
    return date >= this.value.startDate && date <= this.value.endDate;
  }

  public overlaps(other: SchedulePeriod): boolean {
    return this.value.startDate < other.value.endDate && other.value.startDate < this.value.endDate;
  }
}
