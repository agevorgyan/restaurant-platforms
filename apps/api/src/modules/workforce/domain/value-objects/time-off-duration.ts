import { DomainPrimitive } from '@saas/domain';

export class TimeOffDuration extends DomainPrimitive<number> {
  private constructor(value: number) {
    super(value);
  }

  public static create(value: number): TimeOffDuration {
    if (value <= 0) {
      throw new Error('Time off duration must be positive.');
    }
    return new TimeOffDuration(value);
  }
}
