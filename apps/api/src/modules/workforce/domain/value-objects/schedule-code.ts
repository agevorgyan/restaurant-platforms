import { DomainPrimitive } from '@saas/domain';

export class ScheduleCode extends DomainPrimitive<string> {
  private constructor(value: string) {
    super(value);
  }

  public static create(value: string): ScheduleCode {
    if (!value || value.trim().length === 0) {
      throw new Error('Schedule code cannot be empty.');
    }
    return new ScheduleCode(value);
  }
}
