import { Document } from '../entities';
import { MimeType, FileSize, DocumentName } from '../value-objects';

export interface ISpecification<T> {
  isSatisfiedBy(candidate: T): boolean;
}

export class ValidDocumentName implements ISpecification<DocumentName> {
  private static readonly INVALID_CHARS_REGEX = /[<>:"/\\|?*\x00-\x1F]/g;

  public isSatisfiedBy(name: DocumentName): boolean {
    return !ValidDocumentName.INVALID_CHARS_REGEX.test(name.value);
  }
}

export class SupportedMimeType implements ISpecification<MimeType> {
  private static readonly SUPPORTED_TYPES = new Set([
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/gif',
    'text/plain',
    'text/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/json'
  ]);

  public isSatisfiedBy(mimeType: MimeType): boolean {
    return SupportedMimeType.SUPPORTED_TYPES.has(mimeType.value.toLowerCase());
  }
}

export class MaximumFileSize implements ISpecification<FileSize> {
  private readonly maxSizeInBytes: number;

  constructor(maxSizeInBytes: number = 100 * 1024 * 1024) { // Default 100MB
    this.maxSizeInBytes = maxSizeInBytes;
  }

  public isSatisfiedBy(size: FileSize): boolean {
    return size.value <= this.maxSizeInBytes;
  }
}

export class TenantOwnership implements ISpecification<{ document: Document, requestTenantId: string }> {
  public isSatisfiedBy(candidate: { document: Document, requestTenantId: string }): boolean {
    return candidate.document.tenantId.value === candidate.requestTenantId;
  }
}

export class StorageAvailability implements ISpecification<{ providerName: string, isAvailable: boolean }> {
  public isSatisfiedBy(candidate: { providerName: string, isAvailable: boolean }): boolean {
    return candidate.isAvailable === true;
  }
}
