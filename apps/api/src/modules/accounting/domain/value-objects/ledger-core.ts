import { Identifier, DomainPrimitive } from '@saas/domain';
import { ValueObject } from '@saas/core';

export class LedgerId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): LedgerId { return new LedgerId(value); }
  public static generate(): LedgerId { return new LedgerId(crypto.randomUUID()); }
}

export class LedgerCode extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): LedgerCode {
    if (!value || value.trim().length === 0) throw new Error('Ledger code cannot be empty.');
    return new LedgerCode(value);
  }
}

export class LedgerName extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): LedgerName {
    if (!value || value.trim().length === 0) throw new Error('Ledger name cannot be empty.');
    return new LedgerName(value);
  }
}

export enum LedgerTypeEnum {
  GENERAL = 'GENERAL',
  SUB_LEDGER = 'SUB_LEDGER',
  TAX = 'TAX',
  INVENTORY = 'INVENTORY'
}

export class LedgerType extends DomainPrimitive<LedgerTypeEnum> {
  private constructor(value: LedgerTypeEnum) { super(value); }
  public static create(value: LedgerTypeEnum): LedgerType {
    if (!Object.values(LedgerTypeEnum).includes(value)) {
      throw new Error(`Invalid ledger type: ${value}`);
    }
    return new LedgerType(value);
  }
}

export enum LedgerStatusEnum {
  DRAFT = 'DRAFT',
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  ARCHIVED = 'ARCHIVED'
}

export class LedgerStatus extends DomainPrimitive<LedgerStatusEnum> {
  private constructor(value: LedgerStatusEnum) { super(value); }
  public static create(value: LedgerStatusEnum): LedgerStatus {
    if (!Object.values(LedgerStatusEnum).includes(value)) {
      throw new Error(`Invalid ledger status: ${value}`);
    }
    return new LedgerStatus(value);
  }
}

export class BaseCurrency extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): BaseCurrency {
    if (!value || value.trim().length !== 3) throw new Error('Base currency must be a 3-letter code.');
    return new BaseCurrency(value.toUpperCase());
  }
}

interface FiscalYearProps {
  year: number;
  startDate: Date;
  endDate: Date;
}

export class FiscalYear extends ValueObject<FiscalYearProps> {
  private constructor(props: FiscalYearProps) { super(props); }
  public static create(year: number, startDate: Date, endDate: Date): FiscalYear {
    if (startDate >= endDate) throw new Error('Start date must be before end date.');
    return new FiscalYear({ year, startDate, endDate });
  }

  get year(): number { return this.props.year; }
  get startDate(): Date { return this.props.startDate; }
  get endDate(): Date { return this.props.endDate; }
}

export class OpeningBalance extends DomainPrimitive<number> {
  private constructor(value: number) { super(value); }
  public static create(value: number): OpeningBalance {
    return new OpeningBalance(value);
  }
}

export class ClosingBalance extends DomainPrimitive<number> {
  private constructor(value: number) { super(value); }
  public static create(value: number): ClosingBalance {
    return new ClosingBalance(value);
  }
}
