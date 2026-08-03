import { Identifier, DomainPrimitive } from '@saas/domain';

export class PayrollDocumentId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): PayrollDocumentId { return new PayrollDocumentId(value); }
  public static generate(): PayrollDocumentId { return new PayrollDocumentId(crypto.randomUUID()); }
}

export class DocumentNumber extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): DocumentNumber {
    if (!value || value.trim().length === 0) throw new Error('Document number cannot be empty.');
    return new DocumentNumber(value);
  }
}

export class DocumentType extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): DocumentType {
    if (!value || value.trim().length === 0) throw new Error('Document type cannot be empty.');
    return new DocumentType(value);
  }
}

export enum DocumentStatusEnum {
  DRAFT = 'DRAFT',
  GENERATED = 'GENERATED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  FINALIZED = 'FINALIZED',
  ARCHIVED = 'ARCHIVED',
  INVALIDATED = 'INVALIDATED'
}

export class DocumentStatus extends DomainPrimitive<DocumentStatusEnum> {
  private constructor(value: DocumentStatusEnum) { super(value); }
  public static create(value: DocumentStatusEnum): DocumentStatus {
    if (!Object.values(DocumentStatusEnum).includes(value)) {
      throw new Error(`Invalid document status: ${value}`);
    }
    return new DocumentStatus(value);
  }
}

export class DocumentPeriod extends DomainPrimitive<{ startDate: Date, endDate: Date }> {
  private constructor(value: { startDate: Date, endDate: Date }) { super(value); }
  public static create(startDate: Date, endDate: Date): DocumentPeriod {
    if (startDate > endDate) throw new Error('Start date must be before end date.');
    return new DocumentPeriod({ startDate, endDate });
  }
}

export class GenerationDate extends DomainPrimitive<Date> {
  private constructor(value: Date) { super(value); }
  public static create(value: Date): GenerationDate {
    return new GenerationDate(value);
  }
}



export class DocumentVersion extends DomainPrimitive<number> {
  private constructor(value: number) { super(value); }
  public static create(value: number): DocumentVersion {
    if (value <= 0) throw new Error('Document version must be positive.');
    return new DocumentVersion(value);
  }
}
