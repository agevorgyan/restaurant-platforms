import { DomainPrimitive } from '@saas/domain';

export class HourlyRate extends DomainPrimitive<number> {
  private constructor(value: number) {
    super(value);
  }

  public static create(value: number): HourlyRate {
    if (value < 0) {
      throw new Error('Hourly rate cannot be negative.');
    }
    return new HourlyRate(value);
  }
}
