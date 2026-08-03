import { Identifier, DomainPrimitive } from '@saas/domain';
import { ValueObject } from '@saas/core';

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
