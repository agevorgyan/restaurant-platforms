import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { 
  DocumentStorageService, 
  DocumentLifecycleService 
} from '../../domain/services';
import { DocumentFactory, CreateDocumentDto } from '../../domain/factories';
import { DocumentSummary, DocumentDetails, StorageStatistics } from '../../application/read-models';
import { DocumentRepository } from '../../domain/repositories';
import { TenantId, DocumentId } from '../../domain/value-objects';

@Controller('documents')
export class EnterpriseDocumentController {
  constructor(
    private readonly factory: DocumentFactory,
    private readonly storageService: DocumentStorageService,
    private readonly lifecycleService: DocumentLifecycleService,
    private readonly repository: DocumentRepository
  ) {}

  @Get()
  async getDocuments(
    @Query('tenantId') tenantId: string,
    @Query('skip') skip: number = 0,
    @Query('take') take: number = 20
  ): Promise<DocumentSummary[]> {
    if (!tenantId) throw new Error('tenantId is required');
    const docs = await this.repository.findByTenantId(TenantId.create(tenantId), skip, take);
    
    return docs.map(d => ({
      id: d.id,
      tenantId: d.tenantId.value,
      name: d.name.value,
      type: d.type.value,
      status: d.status.value,
      visibility: d.visibility.value,
      tags: d.props.tags,
      createdAt: d.props.createdAt,
      updatedAt: d.props.updatedAt
    }));
  }

  @Get('statistics')
  async getStatistics(@Query('tenantId') tenantId: string): Promise<StorageStatistics> {
    if (!tenantId) throw new Error('tenantId is required');
    const total = await this.repository.countByTenantId(TenantId.create(tenantId));
    return {
      tenantId,
      totalDocuments: total,
      totalStorageBytes: 0, // Mock for now
      storageByClass: { HOT: total, WARM: 0, COLD: 0, ARCHIVE: 0 },
      storageByType: { INVOICE: total },
      lastCalculated: new Date()
    };
  }

  @Get(':id')
  async getDocument(
    @Param('id') id: string,
    @Query('tenantId') tenantId: string
  ): Promise<DocumentDetails> {
    if (!tenantId) throw new Error('tenantId is required');
    const doc = await this.repository.findById(DocumentId.create(id), TenantId.create(tenantId));
    if (!doc) throw new Error('Document not found');

    return {
      id: doc.id,
      tenantId: doc.tenantId.value,
      name: doc.name.value,
      type: doc.type.value,
      status: doc.status.value,
      visibility: doc.visibility.value,
      mimeType: doc.props.mimeType?.value,
      fileSize: doc.fileSize?.value,
      tags: doc.props.tags,
      provider: doc.props.provider?.value,
      bucket: doc.props.bucket?.value,
      objectKey: doc.objectKey?.value,
      extension: doc.props.extension?.value,
      checksum: doc.checksum?.value,
      storageClass: doc.props.storageClass?.value,
      metadata: doc.props.metadata,
      createdBy: doc.props.createdBy.value,
      createdAt: doc.props.createdAt,
      updatedAt: doc.props.updatedAt,
      presignedUrl: 'https://mock-presigned-url.com/download'
    };
  }

  @Post()
  async createDocument(@Body() dto: CreateDocumentDto): Promise<{ id: string, uploadUrl: string }> {
    const document = this.factory.createDocument(dto);
    await this.repository.save(document);
    
    return {
      id: document.id,
      uploadUrl: `https://mock-storage.com/upload/${document.id}`
    };
  }

  @Patch(':id/complete-upload')
  async completeUpload(
    @Param('id') id: string,
    @Query('tenantId') tenantId: string,
    @Body() payload: { 
      provider: string, 
      bucket: string, 
      objectKey: string, 
      mimeType: string, 
      extension: string, 
      size: number, 
      checksum: string 
    }
  ): Promise<{ status: string }> {
    const doc = await this.repository.findById(DocumentId.create(id), TenantId.create(tenantId));
    if (!doc) throw new Error('Document not found');

    await this.storageService.completeUpload(
      doc, 
      payload.provider, 
      payload.bucket, 
      payload.objectKey, 
      payload.mimeType, 
      payload.extension, 
      payload.size, 
      payload.checksum
    );

    return { status: 'UPLOAD_COMPLETED' };
  }

  @Post(':id/archive')
  async archiveDocument(
    @Param('id') id: string,
    @Query('tenantId') tenantId: string
  ): Promise<{ status: string }> {
    await this.lifecycleService.archiveDocument(id, tenantId);
    return { status: 'ARCHIVED' };
  }

  @Post(':id/restore')
  async restoreDocument(
    @Param('id') id: string,
    @Query('tenantId') tenantId: string
  ): Promise<{ status: string }> {
    await this.lifecycleService.restoreDocument(id, tenantId);
    return { status: 'RESTORED' };
  }

  @Delete(':id')
  async deleteDocument(
    @Param('id') id: string,
    @Query('tenantId') tenantId: string
  ): Promise<{ status: string }> {
    await this.lifecycleService.deleteDocument(id, tenantId);
    return { status: 'DELETED' };
  }
}
