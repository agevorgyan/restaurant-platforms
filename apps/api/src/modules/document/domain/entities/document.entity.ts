import { AggregateRoot } from '@saas/core';
import { 
  DocumentId, 
  TenantId, 
  StorageProvider, 
  StorageBucket, 
  ObjectKey, 
  DocumentName, 
  MimeType, 
  FileExtension, 
  FileSize, 
  Checksum, 
  DocumentStatus, 
  DocumentVisibility, 
  DocumentType, 
  StorageClass, 
  CreatedBy,
  DocumentStatusEnum,
  DocumentVisibilityEnum,
  StorageClassEnum,
  DocumentTypeEnum
} from '../value-objects';
import { 
  DocumentCreated,
  DocumentUploaded,
  DocumentArchived,
  DocumentDeleted,
  DocumentRestored,
  DocumentMetadataUpdated,
  DocumentProcessingStarted,
  DocumentProcessingCompleted
} from '../events';

export interface DocumentProps {
  id: DocumentId;
  tenantId: TenantId;
  type: DocumentType;
  name: DocumentName;
  visibility: DocumentVisibility;
  createdBy: CreatedBy;
  
  // Storage Info (populated on upload)
  status: DocumentStatus;
  provider?: StorageProvider;
  bucket?: StorageBucket;
  objectKey?: ObjectKey;
  mimeType?: MimeType;
  extension?: FileExtension;
  fileSize?: FileSize;
  checksum?: Checksum;
  storageClass?: StorageClass;
  
  tags: string[];
  metadata: Record<string, any>;
  
  createdAt: Date;
  updatedAt: Date;
}

export class Document extends AggregateRoot<DocumentProps> {
  
  public get tenantId(): TenantId { return this.props.tenantId; }
  public get type(): DocumentType { return this.props.type; }
  public get status(): DocumentStatus { return this.props.status; }
  public get name(): DocumentName { return this.props.name; }
  public get visibility(): DocumentVisibility { return this.props.visibility; }
  public get objectKey(): ObjectKey | undefined { return this.props.objectKey; }
  public get fileSize(): FileSize | undefined { return this.props.fileSize; }
  public get checksum(): Checksum | undefined { return this.props.checksum; }

  private constructor(props: DocumentProps) {
    super(props.id.toValue(), props);
  }

  public static create(props: Omit<DocumentProps, 'createdAt' | 'updatedAt' | 'status'>): Document {
    const document = new Document({
      ...props,
      status: DocumentStatus.create(DocumentStatusEnum.UPLOADING),
      createdAt: new Date(),
      updatedAt: new Date()
    });

    document.addDomainEvent(new DocumentCreated(
      document.id,
      document.tenantId.toValue(),
      document.type.toValue(),
      document.visibility.toValue(),
      document.props.createdBy.toValue()
    ));

    return document;
  }

  public markAsUploaded(
    provider: StorageProvider,
    bucket: StorageBucket,
    objectKey: ObjectKey,
    mimeType: MimeType,
    extension: FileExtension,
    fileSize: FileSize,
    checksum: Checksum
  ): void {
    if (this.props.status.value !== DocumentStatusEnum.UPLOADING) {
      throw new Error('Can only mark UPLOADING documents as uploaded');
    }

    this.props.status = DocumentStatus.create(DocumentStatusEnum.AVAILABLE);
    this.props.storageClass = StorageClass.create(StorageClassEnum.HOT);
    this.props.provider = provider;
    this.props.bucket = bucket;
    this.props.objectKey = objectKey;
    this.props.mimeType = mimeType;
    this.props.extension = extension;
    this.props.fileSize = fileSize;
    this.props.checksum = checksum;
    this.props.updatedAt = new Date();

    this.addDomainEvent(new DocumentUploaded(
      this.id,
      this.tenantId.value,
      this.objectKey.value,
      this.fileSize.value,
      this.checksum.value
    ));
  }

  public archive(): void {
    if (this.props.status.value === DocumentStatusEnum.DELETED) {
      throw new Error('Cannot archive a deleted document');
    }

    this.props.status = DocumentStatus.create(DocumentStatusEnum.ARCHIVED);
    this.props.storageClass = StorageClass.create(StorageClassEnum.ARCHIVE);
    this.props.updatedAt = new Date();

    this.addDomainEvent(new DocumentArchived(this.id, this.tenantId.value));
  }

  public restore(): void {
    if (this.props.status.value !== DocumentStatusEnum.ARCHIVED) {
      throw new Error('Only archived documents can be restored');
    }

    this.props.status = DocumentStatus.create(DocumentStatusEnum.AVAILABLE);
    this.props.storageClass = StorageClass.create(StorageClassEnum.HOT);
    this.props.updatedAt = new Date();

    this.addDomainEvent(new DocumentRestored(this.id, this.tenantId.value));
  }

  public delete(): void {
    this.props.status = DocumentStatus.create(DocumentStatusEnum.DELETED);
    this.props.updatedAt = new Date();
    
    this.addDomainEvent(new DocumentDeleted(this.id, this.tenantId.value));
  }

  public updateMetadata(metadata: Record<string, any>, tags: string[]): void {
    this.props.metadata = { ...this.props.metadata, ...metadata };
    this.props.tags = [...new Set([...this.props.tags, ...tags])];
    this.props.updatedAt = new Date();

    this.addDomainEvent(new DocumentMetadataUpdated(this.id, this.tenantId.value, this.props.metadata));
  }

  public startProcessing(processorType: string): void {
    this.props.status = DocumentStatus.create(DocumentStatusEnum.PROCESSING);
    this.props.updatedAt = new Date();
    this.addDomainEvent(new DocumentProcessingStarted(this.id, this.tenantId.value, processorType));
  }

  public completeProcessing(processorType: string, results: Record<string, any>): void {
    this.props.status = DocumentStatus.create(DocumentStatusEnum.AVAILABLE);
    this.props.updatedAt = new Date();
    // In a real system, we might merge results into metadata or a separate domain entity
    this.addDomainEvent(new DocumentProcessingCompleted(this.id, this.tenantId.value, processorType, results));
  }
}
