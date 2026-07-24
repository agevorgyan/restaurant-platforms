import { DomainPrimitive } from '@saas/domain';

export class OvertimeDuration extends DomainPrimitive<number> {
  private constructor(value: number) {
    super(value);
  }

  public static create(value: number = 0): OvertimeDuration {
    if (value < 0) {
      throw new Error('Overtime duration cannot be negative.');
    }
    return new OvertimeDuration(value);
  }
}
