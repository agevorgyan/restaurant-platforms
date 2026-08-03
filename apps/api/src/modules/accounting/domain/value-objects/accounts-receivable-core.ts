import { Identifier, DomainPrimitive } from '@saas/domain';
import { ValueObject } from '@saas/core';

export class ReceivableId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): ReceivableId { return new ReceivableId(value); }
  public static generate(): ReceivableId { return new ReceivableId(crypto.randomUUID()); }
}

export class ReceivableNumber extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): ReceivableNumber {
    if (!value || value.trim().length === 0) throw new Error('Receivable number cannot be empty.');
    return new ReceivableNumber(value);
  }
}

export class CustomerReference extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): CustomerReference {
    return new CustomerReference(value);
  }
}

export class InvoiceReference extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): InvoiceReference {
    return new InvoiceReference(value);
  }
}

export enum ReceivableStatusEnum {
  DRAFT = 'DRAFT',
  ISSUED = 'ISSUED',
  PARTIALLY_PAID = 'PARTIALLY_PAID',
  CLOSED = 'CLOSED',
  WRITTEN_OFF = 'WRITTEN_OFF'
}

export class ReceivableStatus extends DomainPrimitive<ReceivableStatusEnum> {
  private constructor(value: ReceivableStatusEnum) { super(value); }
  public static create(value: ReceivableStatusEnum): ReceivableStatus {
    if (!Object.values(ReceivableStatusEnum).includes(value)) {
      throw new Error(`Invalid receivable status: ${value}`);
    }
    return new ReceivableStatus(value);
  }
}

export class DueDate extends DomainPrimitive<Date> {
  private constructor(value: Date) { super(value); }
  public static create(value: Date): DueDate {
    return new DueDate(value);
  }
}

export class IssueDate extends DomainPrimitive<Date> {
  private constructor(value: Date) { super(value); }
  public static create(value: Date): IssueDate {
    return new IssueDate(value);
  }
}

export class OutstandingAmount extends DomainPrimitive<number> {
  private constructor(value: number) { super(value); }
  public static create(value: number): OutstandingAmount {
    if (value < 0) throw new Error('Outstanding amount cannot be negative.');
    return new OutstandingAmount(value);
  }
}

export class OriginalAmount extends DomainPrimitive<number> {
  private constructor(value: number) { super(value); }
  public static create(value: number): OriginalAmount {
    if (value <= 0) throw new Error('Original amount must be strictly positive.');
    return new OriginalAmount(value);
  }
}

export class CreditTerms extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): CreditTerms {
    return new CreditTerms(value);
  }
}
