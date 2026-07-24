import { DomainPrimitive } from '@saas/domain';

export class GrossSalary extends DomainPrimitive<number> {
  private constructor(value: number) { super(value); }
  public static create(value: number): GrossSalary {
    if (value < 0) throw new Error('Gross salary cannot be negative.');
    return new GrossSalary(value);
  }
}

export class NetSalary extends DomainPrimitive<number> {
  private constructor(value: number) { super(value); }
  public static create(value: number): NetSalary {
    if (value < 0) throw new Error('Net salary cannot be negative.');
    return new NetSalary(value);
  }
}

export class HourlyRate extends DomainPrimitive<number> {
  private constructor(value: number) { super(value); }
  public static create(value: number): HourlyRate {
    if (value < 0) throw new Error('Hourly rate cannot be negative.');
    return new HourlyRate(value);
  }
}

export class MonthlySalary extends DomainPrimitive<number> {
  private constructor(value: number) { super(value); }
  public static create(value: number): MonthlySalary {
    if (value < 0) throw new Error('Monthly salary cannot be negative.');
    return new MonthlySalary(value);
  }
}

export class BonusAmount extends DomainPrimitive<number> {
  private constructor(value: number) { super(value); }
  public static create(value: number): BonusAmount {
    if (value < 0) throw new Error('Bonus amount cannot be negative.');
    return new BonusAmount(value);
  }
}

export class DeductionAmount extends DomainPrimitive<number> {
  private constructor(value: number) { super(value); }
  public static create(value: number): DeductionAmount {
    if (value < 0) throw new Error('Deduction amount cannot be negative.');
    return new DeductionAmount(value);
  }
}

export class TaxAmount extends DomainPrimitive<number> {
  private constructor(value: number) { super(value); }
  public static create(value: number): TaxAmount {
    if (value < 0) throw new Error('Tax amount cannot be negative.');
    return new TaxAmount(value);
  }
}
