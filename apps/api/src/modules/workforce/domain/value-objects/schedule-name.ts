import { DomainPrimitive } from '@saas/domain';

export class ScheduleName extends DomainPrimitive<string> {
  private constructor(value: string) {
    super(value);
  }

  public static create(value: string): ScheduleName {
    if (!value || value.trim().length === 0) {
      throw new Error('Schedule name cannot be empty.');
    }
    return new ScheduleName(value);
  }
}
