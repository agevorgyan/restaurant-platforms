import { DomainPrimitive } from '@saas/domain';

export class ShiftStartTime extends DomainPrimitive<Date> {
  private constructor(value: Date) {
    super(value);
  }

  public static create(value: Date): ShiftStartTime {
    if (!(value instanceof Date) || isNaN(value.getTime())) {
      throw new Error('Invalid start time.');
    }
    return new ShiftStartTime(value);
  }
}
