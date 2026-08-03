import { Identifier, DomainPrimitive } from '@saas/domain';
import { ValueObject } from '@saas/core';

export class JournalEntryId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): JournalEntryId { return new JournalEntryId(value); }
  public static generate(): JournalEntryId { return new JournalEntryId(crypto.randomUUID()); }
}

export class JournalNumber extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): JournalNumber {
    if (!value || value.trim().length === 0) throw new Error('Journal number cannot be empty.');
    return new JournalNumber(value);
  }
}

export enum JournalTypeEnum {
  GENERAL = 'GENERAL',
  PAYROLL = 'PAYROLL',
  SALES = 'SALES',
  PAYMENT = 'PAYMENT',
  INVENTORY = 'INVENTORY',
  ADJUSTMENT = 'ADJUSTMENT'
}

export class JournalType extends DomainPrimitive<JournalTypeEnum> {
  private constructor(value: JournalTypeEnum) { super(value); }
  public static create(value: JournalTypeEnum): JournalType {
    if (!Object.values(JournalTypeEnum).includes(value)) {
      throw new Error(`Invalid journal type: ${value}`);
    }
    return new JournalType(value);
  }
}

export class PostingDate extends DomainPrimitive<Date> {
  private constructor(value: Date) { super(value); }
  public static create(value: Date): PostingDate {
    return new PostingDate(value);
  }
}

export class AccountingDate extends DomainPrimitive<Date> {
  private constructor(value: Date) { super(value); }
  public static create(value: Date): AccountingDate {
    return new AccountingDate(value);
  }
}

export class ReferenceNumber extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): ReferenceNumber {
    return new ReferenceNumber(value);
  }
}

export enum JournalStatusEnum {
  DRAFT = 'DRAFT',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  POSTED = 'POSTED',
  REVERSED = 'REVERSED',
  VOIDED = 'VOIDED'
}

export class JournalStatus extends DomainPrimitive<JournalStatusEnum> {
  private constructor(value: JournalStatusEnum) { super(value); }
  public static create(value: JournalStatusEnum): JournalStatus {
    if (!Object.values(JournalStatusEnum).includes(value)) {
      throw new Error(`Invalid journal status: ${value}`);
    }
    return new JournalStatus(value);
  }
}

export class PostingPeriod extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): PostingPeriod {
    return new PostingPeriod(value);
  }
}

export class Currency extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): Currency {
    if (!value || value.trim().length !== 3) throw new Error('Currency must be a 3-letter code.');
    return new Currency(value.toUpperCase());
  }
}

export class ExchangeRate extends DomainPrimitive<number> {
  private constructor(value: number) { super(value); }
  public static create(value: number): ExchangeRate {
    if (value <= 0) throw new Error('Exchange rate must be strictly positive.');
    return new ExchangeRate(value);
  }
}

export class Memo extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): Memo {
    return new Memo(value);
  }
}
