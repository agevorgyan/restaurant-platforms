import { DomainPrimitive } from '@saas/domain';

export class CheckOutTime extends DomainPrimitive<Date> {
  private constructor(value: Date) {
    super(value);
  }

  public static create(value: Date): CheckOutTime {
    if (!(value instanceof Date) || isNaN(value.getTime())) {
      throw new Error('Invalid check-out time.');
    }
    return new CheckOutTime(value);
  }
}
