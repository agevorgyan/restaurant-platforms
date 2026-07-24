import { Document } from '../entities';
import { DocumentId, TenantId } from '../value-objects';

export interface DocumentRepository {
  findById(id: DocumentId, tenantId: TenantId): Promise<Document | null>;
  save(document: Document): Promise<void>;
  delete(id: DocumentId, tenantId: TenantId): Promise<void>;
  findByTenantId(tenantId: TenantId, skip: number, take: number): Promise<Document[]>;
  countByTenantId(tenantId: TenantId): Promise<number>;
  findByTags(tenantId: TenantId, tags: string[], skip: number, take: number): Promise<Document[]>;
}
