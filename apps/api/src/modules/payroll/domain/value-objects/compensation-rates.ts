import { DomainPrimitive } from '@saas/domain';

export class OvertimeRate extends DomainPrimitive<number> {
  private constructor(value: number) { super(value); }
  public static create(value: number): OvertimeRate {
    if (value < 0) throw new Error('Overtime rate cannot be negative.');
    return new OvertimeRate(value);
  }
}

export class NightShiftRate extends DomainPrimitive<number> {
  private constructor(value: number) { super(value); }
  public static create(value: number): NightShiftRate {
    if (value < 0) throw new Error('Night shift rate cannot be negative.');
    return new NightShiftRate(value);
  }
}

export class HolidayRate extends DomainPrimitive<number> {
  private constructor(value: number) { super(value); }
  public static create(value: number): HolidayRate {
    if (value < 0) throw new Error('Holiday rate cannot be negative.');
    return new HolidayRate(value);
  }
}

export class WeekendRate extends DomainPrimitive<number> {
  private constructor(value: number) { super(value); }
  public static create(value: number): WeekendRate {
    if (value < 0) throw new Error('Weekend rate cannot be negative.');
    return new WeekendRate(value);
  }
}
