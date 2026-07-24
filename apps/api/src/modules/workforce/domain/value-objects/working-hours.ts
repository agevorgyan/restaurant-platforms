import { DomainPrimitive } from '@saas/domain';

export class WorkingHours extends DomainPrimitive<number> {
  private constructor(value: number) {
    super(value);
  }

  public static create(value: number): WorkingHours {
    if (value < 0 || value > 168) {
      throw new Error('Working hours must be between 0 and 168 per week.');
    }
    return new WorkingHours(value);
  }
}
