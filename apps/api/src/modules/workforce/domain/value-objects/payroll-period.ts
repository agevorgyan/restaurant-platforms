import { DomainPrimitive } from '@saas/domain';

export interface PayrollPeriodProps {
  startDate: Date;
  endDate: Date;
}

export class PayrollPeriod extends DomainPrimitive<PayrollPeriodProps> {
  private constructor(value: PayrollPeriodProps) {
    super(value);
  }

  public static create(startDate: Date, endDate: Date): PayrollPeriod {
    if (startDate >= endDate) {
      throw new Error('Start date must be before end date.');
    }
    return new PayrollPeriod({ startDate, endDate });
  }

  public overlaps(other: PayrollPeriod): boolean {
    return this.value.startDate <= other.value.endDate && this.value.endDate >= other.value.startDate;
  }
}
