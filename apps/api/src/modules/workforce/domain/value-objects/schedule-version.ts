import { DomainPrimitive } from '@saas/domain';

export class ScheduleVersion extends DomainPrimitive<number> {
  private constructor(value: number) {
    super(value);
  }

  public static create(value: number = 1): ScheduleVersion {
    if (value < 1) {
      throw new Error('Schedule version must be at least 1.');
    }
    return new ScheduleVersion(value);
  }

  public increment(): ScheduleVersion {
    return new ScheduleVersion(this.value + 1);
  }
}
