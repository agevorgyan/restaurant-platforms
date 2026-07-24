import { Identifier, DomainPrimitive } from '@saas/domain';

// ENUMS

export enum DocumentStatusEnum {
  UPLOADING = 'UPLOADING',
  AVAILABLE = 'AVAILABLE',
  PROCESSING = 'PROCESSING',
  ARCHIVED = 'ARCHIVED',
  DELETED = 'DELETED',
  FAILED = 'FAILED'
}

export class DocumentStatus extends DomainPrimitive<DocumentStatusEnum> {
  private constructor(value: DocumentStatusEnum) { super(value); }
  public static create(value: DocumentStatusEnum): DocumentStatus {
    if (!Object.values(DocumentStatusEnum).includes(value)) throw new Error(`Invalid DocumentStatus: ${value}`);
    return new DocumentStatus(value);
  }
}

export enum DocumentVisibilityEnum {
  PRIVATE = 'PRIVATE',
  TENANT = 'TENANT',
  PUBLIC = 'PUBLIC'
}

export class DocumentVisibility extends DomainPrimitive<DocumentVisibilityEnum> {
  private constructor(value: DocumentVisibilityEnum) { super(value); }
  public static create(value: DocumentVisibilityEnum): DocumentVisibility {
    if (!Object.values(DocumentVisibilityEnum).includes(value)) throw new Error(`Invalid DocumentVisibility: ${value}`);
    return new DocumentVisibility(value);
  }
}

export enum StorageClassEnum {
  HOT = 'HOT',
  WARM = 'WARM',
  COLD = 'COLD',
  ARCHIVE = 'ARCHIVE'
}

export class StorageClass extends DomainPrimitive<StorageClassEnum> {
  private constructor(value: StorageClassEnum) { super(value); }
  public static create(value: StorageClassEnum): StorageClass {
    if (!Object.values(StorageClassEnum).includes(value)) throw new Error(`Invalid StorageClass: ${value}`);
    return new StorageClass(value);
  }
}

export enum DocumentTypeEnum {
  INVOICE = 'INVOICE',
  RECEIPT = 'RECEIPT',
  CONTRACT = 'CONTRACT',
  MENU = 'MENU',
  REPORT = 'REPORT',
  MEDIA = 'MEDIA',
  EXPORT = 'EXPORT',
  OTHER = 'OTHER'
}

export class DocumentType extends DomainPrimitive<DocumentTypeEnum> {
  private constructor(value: DocumentTypeEnum) { super(value); }
  public static create(value: DocumentTypeEnum): DocumentType {
    if (!Object.values(DocumentTypeEnum).includes(value)) throw new Error(`Invalid DocumentType: ${value}`);
    return new DocumentType(value);
  }
}

// VALUE OBJECTS

export class DocumentId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): DocumentId { return new DocumentId(value); }
  public static generate(): DocumentId { return new DocumentId(crypto.randomUUID()); }
}

export class TenantId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): TenantId { return new TenantId(value); }
}

export class StorageProvider extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): StorageProvider {
    if (!value || value.trim().length === 0) throw new Error('StorageProvider cannot be empty');
    return new StorageProvider(value);
  }
}

export class StorageBucket extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): StorageBucket {
    if (!value || value.trim().length === 0) throw new Error('StorageBucket cannot be empty');
    return new StorageBucket(value);
  }
}

export class ObjectKey extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): ObjectKey {
    if (!value || value.trim().length === 0) throw new Error('ObjectKey cannot be empty');
    return new ObjectKey(value);
  }
}

export class DocumentName extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): DocumentName {
    if (!value || value.trim().length === 0) throw new Error('DocumentName cannot be empty');
    if (value.length > 255) throw new Error('DocumentName is too long');
    return new DocumentName(value);
  }
}

export class MimeType extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): MimeType {
    if (!value || !value.includes('/')) throw new Error('Invalid MimeType format');
    return new MimeType(value.toLowerCase());
  }
}

export class FileExtension extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): FileExtension {
    if (value && !value.startsWith('.')) value = `.${value}`;
    return new FileExtension(value.toLowerCase());
  }
}

export class FileSize extends DomainPrimitive<number> {
  private constructor(value: number) { super(value); }
  public static create(value: number): FileSize {
    if (value < 0) throw new Error('FileSize cannot be negative');
    return new FileSize(value);
  }
}

export class Checksum extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): Checksum {
    return new Checksum(value);
  }
}

export class ContentHash extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): ContentHash {
    return new ContentHash(value);
  }
}

export class CreatedBy extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): CreatedBy { return new CreatedBy(value); }
}
