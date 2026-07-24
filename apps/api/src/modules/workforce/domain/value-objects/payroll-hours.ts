import { DomainPrimitive } from '@saas/domain';

export class WorkedHours extends DomainPrimitive<number> {
  private constructor(value: number) { super(value); }
  public static create(value: number): WorkedHours {
    if (value < 0) throw new Error('Worked hours cannot be negative.');
    return new WorkedHours(value);
  }
}

export class RegularHours extends DomainPrimitive<number> {
  private constructor(value: number) { super(value); }
  public static create(value: number): RegularHours {
    if (value < 0) throw new Error('Regular hours cannot be negative.');
    return new RegularHours(value);
  }
}

export class OvertimeHours extends DomainPrimitive<number> {
  private constructor(value: number) { super(value); }
  public static create(value: number): OvertimeHours {
    if (value < 0) throw new Error('Overtime hours cannot be negative.');
    return new OvertimeHours(value);
  }
}

export class NightHours extends DomainPrimitive<number> {
  private constructor(value: number) { super(value); }
  public static create(value: number): NightHours {
    if (value < 0) throw new Error('Night hours cannot be negative.');
    return new NightHours(value);
  }
}

export class HolidayHours extends DomainPrimitive<number> {
  private constructor(value: number) { super(value); }
  public static create(value: number): HolidayHours {
    if (value < 0) throw new Error('Holiday hours cannot be negative.');
    return new HolidayHours(value);
  }
}

export class ApprovedAbsenceHours extends DomainPrimitive<number> {
  private constructor(value: number) { super(value); }
  public static create(value: number): ApprovedAbsenceHours {
    if (value < 0) throw new Error('Approved absence hours cannot be negative.');
    return new ApprovedAbsenceHours(value);
  }
}

export class UnapprovedAbsenceHours extends DomainPrimitive<number> {
  private constructor(value: number) { super(value); }
  public static create(value: number): UnapprovedAbsenceHours {
    if (value < 0) throw new Error('Unapproved absence hours cannot be negative.');
    return new UnapprovedAbsenceHours(value);
  }
}
