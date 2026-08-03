import { Document } from '../entities';
import { DocumentRepository } from '../repositories';
import { 
  DocumentId, 
  TenantId, 
  StorageProvider, 
  StorageBucket, 
  ObjectKey, 
  MimeType, 
  FileExtension, 
  FileSize, 
  Checksum 
} from '../value-objects';
import { 
  SupportedMimeType, 
  MaximumFileSize, 
  TenantOwnership, 
  StorageAvailability 
} from '../specifications';

export class DocumentValidationService {
  private readonly mimeTypeSpec = new SupportedMimeType();
  private readonly fileSizeSpec = new MaximumFileSize(); // Default 100MB
  private readonly ownershipSpec = new TenantOwnership();

  public validateForUpload(mimeType: MimeType, fileSize: FileSize): void {
    if (!this.mimeTypeSpec.isSatisfiedBy(mimeType)) {
      throw new Error(`MimeType not supported: ${mimeType.value}`);
    }
    if (!this.fileSizeSpec.isSatisfiedBy(fileSize)) {
      throw new Error(`File size exceeds maximum allowed: ${fileSize.value} bytes`);
    }
  }

  public validateAccess(document: Document, requestTenantId: string): void {
    if (!this.ownershipSpec.isSatisfiedBy({ document, requestTenantId })) {
      throw new Error(`Access denied. Tenant ${requestTenantId} does not own document ${document.id}`);
    }
  }
}

export class IntegrityVerificationService {
  public verifyChecksum(expected: Checksum, actual: Checksum): boolean {
    return expected.value === actual.value;
  }
}

export class DocumentStorageService {
  constructor(
    private readonly repository: DocumentRepository,
    private readonly validationService: DocumentValidationService
  ) {}

  public async completeUpload(
    document: Document,
    provider: string,
    bucket: string,
    objectKey: string,
    mimeType: string,
    extension: string,
    size: number,
    checksum: string
  ): Promise<void> {
    const mimeVO = MimeType.create(mimeType);
    const sizeVO = FileSize.create(size);

    this.validationService.validateForUpload(mimeVO, sizeVO);

    document.markAsUploaded(
      StorageProvider.create(provider),
      StorageBucket.create(bucket),
      ObjectKey.create(objectKey),
      mimeVO,
      FileExtension.create(extension),
      sizeVO,
      Checksum.create(checksum)
    );

    await this.repository.save(document);
  }
}

export class DocumentLifecycleService {
  constructor(
    private readonly repository: DocumentRepository,
    private readonly validationService: DocumentValidationService
  ) {}

  public async archiveDocument(documentId: string, tenantId: string): Promise<void> {
    const docId = DocumentId.create(documentId);
    const tId = TenantId.create(tenantId);
    
    const document = await this.repository.findById(docId, tId);
    if (!document) throw new Error('Document not found');

    this.validationService.validateAccess(document, tenantId);

    document.archive();
    await this.repository.save(document);
  }

  public async restoreDocument(documentId: string, tenantId: string): Promise<void> {
    const docId = DocumentId.create(documentId);
    const tId = TenantId.create(tenantId);
    
    const document = await this.repository.findById(docId, tId);
    if (!document) throw new Error('Document not found');

    this.validationService.validateAccess(document, tenantId);

    document.restore();
    await this.repository.save(document);
  }

  public async deleteDocument(documentId: string, tenantId: string): Promise<void> {
    const docId = DocumentId.create(documentId);
    const tId = TenantId.create(tenantId);
    
    const document = await this.repository.findById(docId, tId);
    if (!document) throw new Error('Document not found');

    this.validationService.validateAccess(document, tenantId);

    document.delete();
    await this.repository.save(document);
  }
}
