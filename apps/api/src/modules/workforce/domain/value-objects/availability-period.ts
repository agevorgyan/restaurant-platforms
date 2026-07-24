import { DomainPrimitive } from '@saas/domain';

export interface AvailabilityPeriodProps {
  startDate: Date;
  endDate: Date;
}

export class AvailabilityPeriod extends DomainPrimitive<AvailabilityPeriodProps> {
  private constructor(value: AvailabilityPeriodProps) {
    super(value);
  }

  public static create(startDate: Date, endDate: Date): AvailabilityPeriod {
    if (startDate >= endDate) {
      throw new Error('Availability period start date must be before end date.');
    }
    return new AvailabilityPeriod({ startDate, endDate });
  }

  public overlaps(other: AvailabilityPeriod): boolean {
    return this.value.startDate < other.value.endDate && other.value.startDate < this.value.endDate;
  }
}
