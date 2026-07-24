import { DomainPrimitive } from '@saas/domain';

export class CheckInTime extends DomainPrimitive<Date> {
  private constructor(value: Date) {
    super(value);
  }

  public static create(value: Date): CheckInTime {
    if (!(value instanceof Date) || isNaN(value.getTime())) {
      throw new Error('Invalid check-in time.');
    }
    return new CheckInTime(value);
  }
}
