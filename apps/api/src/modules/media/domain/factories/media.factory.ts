import { MediaAsset } from '../aggregates';
import { 
  MediaId, TenantId, MediaType, MediaFormat, MimeType, 
  FileSize, Checksum, MediaStatus, VisibilityPolicy, MediaPurpose,
  MediaStatusEnum, VisibilityPolicyEnum, MediaTypeEnum
} from '../value-objects';
import { MediaUploaded } from '../events';

export class MediaFactory {
  public static createNewUpload(
    tenantId: string,
    type: MediaTypeEnum,
    format: string,
    mimeType: string,
    fileSize: number,
    checksum: string,
    storageKey: string,
    purpose: string = 'GENERAL',
    visibility: VisibilityPolicyEnum = VisibilityPolicyEnum.TENANT
  ): MediaAsset {
    const asset = MediaAsset.create({
      mediaId: MediaId.generate(),
      tenantId: TenantId.create(tenantId),
      type: MediaType.create(type),
      format: MediaFormat.create(format),
      mimeType: MimeType.create(mimeType),
      fileSize: FileSize.create(fileSize),
      checksum: Checksum.create(checksum),
      status: MediaStatus.create(MediaStatusEnum.UPLOADING),
      visibility: VisibilityPolicy.create(visibility),
      purpose: MediaPurpose.create(purpose),
      storageKey,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    asset.addDomainEvent(new MediaUploaded(
      asset.mediaId.toValue(),
      asset.tenantId.toValue(),
      type,
      mimeType,
      fileSize,
      checksum
    ));

    return asset;
  }
}
