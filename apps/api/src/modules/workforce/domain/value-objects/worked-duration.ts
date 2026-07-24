import { DomainPrimitive } from '@saas/domain';

export class WorkedDuration extends DomainPrimitive<number> {
  private constructor(value: number) {
    super(value);
  }

  public static create(value: number): WorkedDuration {
    if (value < 0) {
      throw new Error('Worked duration cannot be negative.');
    }
    return new WorkedDuration(value);
  }
}
