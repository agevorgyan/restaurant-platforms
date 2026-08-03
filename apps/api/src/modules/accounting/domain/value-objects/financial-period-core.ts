import { Identifier, DomainPrimitive } from '@saas/domain';

export class FinancialPeriodId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): FinancialPeriodId { return new FinancialPeriodId(value); }
  public static generate(): FinancialPeriodId { return new FinancialPeriodId(crypto.randomUUID()); }
}

/** Represents a fiscal year as a numeric value (e.g., 2024). */
export class FiscalYearNumber extends DomainPrimitive<number> {
  private constructor(value: number) { super(value); }
  public static create(value: number): FiscalYearNumber {
    if (value < 1900 || value > 2100) throw new Error('Invalid fiscal year.');
    return new FiscalYearNumber(value);
  }
}

export class FiscalQuarter extends DomainPrimitive<number> {
  private constructor(value: number) { super(value); }
  public static create(value: number): FiscalQuarter {
    if (value < 1 || value > 4) throw new Error('Fiscal quarter must be between 1 and 4.');
    return new FiscalQuarter(value);
  }
}

export class FiscalMonth extends DomainPrimitive<number> {
  private constructor(value: number) { super(value); }
  public static create(value: number): FiscalMonth {
    if (value < 1 || value > 12) throw new Error('Fiscal month must be between 1 and 12.');
    return new FiscalMonth(value);
  }
}

export class PeriodCode extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): PeriodCode {
    if (!value || value.trim().length === 0) throw new Error('Period code cannot be empty.');
    return new PeriodCode(value);
  }
}

export class PeriodName extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): PeriodName {
    if (!value || value.trim().length === 0) throw new Error('Period name cannot be empty.');
    return new PeriodName(value);
  }
}

export enum PeriodStatusEnum {
  DRAFT = 'DRAFT',
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  LOCKED = 'LOCKED',
  ARCHIVED = 'ARCHIVED'
}

export class PeriodStatus extends DomainPrimitive<PeriodStatusEnum> {
  private constructor(value: PeriodStatusEnum) { super(value); }
  public static create(value: PeriodStatusEnum): PeriodStatus {
    if (!Object.values(PeriodStatusEnum).includes(value)) {
      throw new Error(`Invalid period status: ${value}`);
    }
    return new PeriodStatus(value);
  }
}

export class OpenDate extends DomainPrimitive<Date> {
  private constructor(value: Date) { super(value); }
  public static create(value: Date): OpenDate {
    return new OpenDate(value);
  }
}

export class CloseDate extends DomainPrimitive<Date> {
  private constructor(value: Date) { super(value); }
  public static create(value: Date): CloseDate {
    return new CloseDate(value);
  }
}

export class LockDate extends DomainPrimitive<Date | null> {
  private constructor(value: Date | null) { super(value); }
  public static create(value: Date | null): LockDate {
    return new LockDate(value);
  }
}
