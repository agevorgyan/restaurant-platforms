import { ValueObject } from '@saas/core';

export interface EffectivePeriodProps {
  startDate: Date;
  endDate?: Date;
}

export class EffectivePeriod extends ValueObject<EffectivePeriodProps> {
  private constructor(props: EffectivePeriodProps) {
    super(props);
  }

  public static create(startDate: Date, endDate?: Date): EffectivePeriod {
    if (endDate && startDate >= endDate) {
      throw new Error('Start date must be before end date');
    }
    return new EffectivePeriod({ startDate, endDate });
  }

  get startDate(): Date {
    return this.props.startDate;
  }

  get endDate(): Date | undefined {
    return this.props.endDate;
  }

  public isActiveAt(date: Date): boolean {
    if (date < this.props.startDate) {
      return false;
    }
    if (this.props.endDate && date > this.props.endDate) {
      return false;
    }
    return true;
  }

  public overlapsWith(other: EffectivePeriod): boolean {
    if (this.props.endDate && other.props.startDate > this.props.endDate) {
      return false;
    }
    if (other.props.endDate && this.props.startDate > other.props.endDate) {
      return false;
    }
    return true;
  }
}
