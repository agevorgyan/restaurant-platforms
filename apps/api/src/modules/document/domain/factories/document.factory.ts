import { Document } from '../entities';
import { 
  DocumentId, 
  TenantId, 
  DocumentName, 
  DocumentVisibility, 
  DocumentType, 
  CreatedBy,
  DocumentVisibilityEnum,
  DocumentTypeEnum
} from '../value-objects';
import { ValidDocumentName } from '../specifications';

export interface CreateDocumentDto {
  tenantId: string;
  name: string;
  type: string;
  visibility?: string;
  createdBy: string;
  tags?: string[];
  metadata?: Record<string, any>;
}

export class DocumentFactory {
  private readonly nameSpec = new ValidDocumentName();

  public createDocument(dto: CreateDocumentDto): Document {
    const nameVO = DocumentName.create(dto.name);
    
    if (!this.nameSpec.isSatisfiedBy(nameVO)) {
      throw new Error(`Invalid document name: ${dto.name}`);
    }

    const typeVO = DocumentType.create(dto.type as DocumentTypeEnum);
    
    // Default to TENANT visibility if not specified
    const visibilityEnum = dto.visibility 
      ? (dto.visibility as DocumentVisibilityEnum) 
      : DocumentVisibilityEnum.TENANT;
    const visibilityVO = DocumentVisibility.create(visibilityEnum);

    return Document.create({
      id: DocumentId.generate(),
      tenantId: TenantId.create(dto.tenantId),
      type: typeVO,
      name: nameVO,
      visibility: visibilityVO,
      createdBy: CreatedBy.create(dto.createdBy),
      tags: dto.tags || [],
      metadata: dto.metadata || {}
    });
  }
}
