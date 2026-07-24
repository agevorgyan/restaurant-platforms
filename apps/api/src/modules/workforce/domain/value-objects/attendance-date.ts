import { DomainPrimitive } from '@saas/domain';

export class AttendanceDate extends DomainPrimitive<Date> {
  private constructor(value: Date) {
    super(value);
  }

  public static create(value: Date): AttendanceDate {
    if (!(value instanceof Date) || isNaN(value.getTime())) {
      throw new Error('Invalid attendance date.');
    }
    // Normalize to date only
    const normalized = new Date(value);
    normalized.setHours(0, 0, 0, 0);
    return new AttendanceDate(normalized);
  }
}
