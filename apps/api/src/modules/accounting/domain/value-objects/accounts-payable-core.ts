import { Identifier, DomainPrimitive, ValueObject } from '@saas/domain';

export class PayableId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): PayableId { return new PayableId(value); }
  public static generate(): PayableId { return new PayableId(crypto.randomUUID()); }
}

export class PayableNumber extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): PayableNumber {
    if (!value || value.trim().length === 0) throw new Error('Payable number cannot be empty.');
    return new PayableNumber(value);
  }
}

export class SupplierReference extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): SupplierReference {
    return new SupplierReference(value);
  }
}

export class VendorInvoiceNumber extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): VendorInvoiceNumber {
    return new VendorInvoiceNumber(value);
  }
}

export class PurchaseOrderReference extends DomainPrimitive<string | null> {
  private constructor(value: string | null) { super(value); }
  public static create(value: string | null): PurchaseOrderReference {
    return new PurchaseOrderReference(value);
  }
}

export enum PayableStatusEnum {
  DRAFT = 'DRAFT',
  REGISTERED = 'REGISTERED',
  APPROVED = 'APPROVED',
  PARTIALLY_PAID = 'PARTIALLY_PAID',
  CLOSED = 'CLOSED',
  WRITTEN_OFF = 'WRITTEN_OFF'
}

export class PayableStatus extends DomainPrimitive<PayableStatusEnum> {
  private constructor(value: PayableStatusEnum) { super(value); }
  public static create(value: PayableStatusEnum): PayableStatus {
    if (!Object.values(PayableStatusEnum).includes(value)) {
      throw new Error(`Invalid payable status: ${value}`);
    }
    return new PayableStatus(value);
  }
}

// Re-using common structural VOs from AccountsReceivable logic, but keeping isolated instances
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

export class PaymentTerms extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): PaymentTerms {
    return new PaymentTerms(value);
  }
}

export enum PriorityEnum {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export class Priority extends DomainPrimitive<PriorityEnum> {
  private constructor(value: PriorityEnum) { super(value); }
  public static create(value: PriorityEnum): Priority {
    if (!Object.values(PriorityEnum).includes(value)) {
      throw new Error(`Invalid priority: ${value}`);
    }
    return new Priority(value);
  }
}
