import { ValueObject } from '@saas/core';

export interface CouponValidityPeriodProps {
  startDate?: Date;
  endDate?: Date;
}

export class CouponValidityPeriod extends ValueObject<CouponValidityPeriodProps> {
  private constructor(props: CouponValidityPeriodProps) {
    super(props);
  }

  public static create(startDate?: Date, endDate?: Date): CouponValidityPeriod {
    if (startDate && endDate && startDate > endDate) {
      throw new Error('Start date cannot be after end date');
    }
    return new CouponValidityPeriod({ startDate, endDate });
  }

  get startDate(): Date | undefined {
    return this.props.startDate;
  }

  get endDate(): Date | undefined {
    return this.props.endDate;
  }

  public isValid(date: Date = new Date()): boolean {
    if (this.startDate && date < this.startDate) {
      return false;
    }
    if (this.endDate && date > this.endDate) {
      return false;
    }
    return true;
  }

  public isExpired(date: Date = new Date()): boolean {
    if (!this.endDate) return false;
    return date > this.endDate;
  }
}
