import { DomainPrimitive } from '@saas/domain';

export class ShiftEndTime extends DomainPrimitive<Date> {
  private constructor(value: Date) {
    super(value);
  }

  public static create(value: Date): ShiftEndTime {
    if (!(value instanceof Date) || isNaN(value.getTime())) {
      throw new Error('Invalid end time.');
    }
    return new ShiftEndTime(value);
  }
}
