import { DomainPrimitive } from '@saas/domain';

export class BreakDuration extends DomainPrimitive<number> {
  private constructor(value: number) {
    super(value);
  }

  public static create(value: number): BreakDuration {
    if (value < 0) {
      throw new Error('Break duration cannot be negative.');
    }
    return new BreakDuration(value);
  }
}
