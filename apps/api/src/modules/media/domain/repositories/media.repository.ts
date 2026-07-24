import { MediaAsset } from '../aggregates';
import { MediaId, TenantId, MediaStatusEnum } from '../value-objects';

export interface IMediaRepository {
  save(asset: MediaAsset): Promise<void>;
  findById(tenantId: TenantId, mediaId: MediaId): Promise<MediaAsset | null>;
  findByStatus(tenantId: TenantId, status: MediaStatusEnum): Promise<MediaAsset[]>;
  delete(tenantId: TenantId, mediaId: MediaId): Promise<void>;
}
