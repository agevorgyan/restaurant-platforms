import { DomainPrimitive } from '@saas/domain';

export class AttendanceComment extends DomainPrimitive<string> {
  private constructor(value: string) {
    super(value);
  }

  public static create(value: string): AttendanceComment {
    if (!value || value.trim().length === 0) {
      throw new Error('Attendance comment cannot be empty.');
    }
    return new AttendanceComment(value);
  }
}
