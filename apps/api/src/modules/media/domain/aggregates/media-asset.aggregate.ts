import { AggregateRoot } from '@saas/core';
import {
  MediaId,
  TenantId,
  MediaType,
  MediaFormat,
  MimeType,
  Resolution,
  Duration,
  Bitrate,
  FileSize,
  Checksum,
  MediaStatus,
  VisibilityPolicy,
  MediaPurpose,
  MediaStatusEnum,
  VisibilityPolicyEnum
} from '../value-objects';
import {
  MediaArchived,
  MediaDeleted,
  MediaMetadataUpdated,
  MediaRestored
} from '../events';

export interface MediaAssetProps {
  mediaId: MediaId;
  tenantId: TenantId;
  type: MediaType;
  format: MediaFormat;
  mimeType: MimeType;
  fileSize: FileSize;
  checksum: Checksum;
  status: MediaStatus;
  visibility: VisibilityPolicy;
  purpose: MediaPurpose;
  storageKey: string;
  resolution?: Resolution;
  duration?: Duration;
  bitrate?: Bitrate;
  metadata?: Record<string, any>;
  variants?: Record<string, string>; // e.g., { "thumbnail": "key/path", "1080p": "key/path" }
  createdAt: Date;
  updatedAt: Date;
}

export class MediaAsset extends AggregateRoot<MediaAssetProps> {
  private constructor(props: MediaAssetProps, id?: string) {
    super(id ?? props.mediaId.toValue(), props);
  }

  public static create(props: MediaAssetProps, id?: string): MediaAsset {
    return new MediaAsset(props, id);
  }

  get mediaId(): MediaId { return this.props.mediaId; }
  get tenantId(): TenantId { return this.props.tenantId; }
  get status(): MediaStatus { return this.props.status; }
  get storageKey(): string { return this.props.storageKey; }
  get visibility(): VisibilityPolicy { return this.props.visibility; }

  public updateMetadata(updates: Record<string, any>): void {
    this.props.metadata = { ...this.props.metadata, ...updates };
    this.props.updatedAt = new Date();
    
    // Abstract event tracking; assuming aggregate base supports event registration, or emit via service
    this.addDomainEvent(new MediaMetadataUpdated(
      this.mediaId.toValue(),
      this.tenantId.toValue(),
      updates
    ));
  }

  public addVariant(name: string, path: string): void {
    if (!this.props.variants) {
      this.props.variants = {};
    }
    this.props.variants[name] = path;
    this.props.updatedAt = new Date();
  }

  public archive(): void {
    if (this.props.status.toValue() === MediaStatusEnum.DELETED) {
      throw new Error('Cannot archive a deleted media asset');
    }
    this.props.status = MediaStatus.create(MediaStatusEnum.ARCHIVED);
    this.props.updatedAt = new Date();
    this.addDomainEvent(new MediaArchived(this.mediaId.toValue(), this.tenantId.toValue()));
  }

  public restore(): void {
    if (this.props.status.toValue() !== MediaStatusEnum.ARCHIVED) {
      throw new Error('Only archived assets can be restored');
    }
    this.props.status = MediaStatus.create(MediaStatusEnum.AVAILABLE);
    this.props.updatedAt = new Date();
    this.addDomainEvent(new MediaRestored(this.mediaId.toValue(), this.tenantId.toValue()));
  }

  public delete(): void {
    this.props.status = MediaStatus.create(MediaStatusEnum.DELETED);
    this.props.updatedAt = new Date();
    this.addDomainEvent(new MediaDeleted(this.mediaId.toValue(), this.tenantId.toValue()));
  }

  public makePublic(): void {
    this.props.visibility = VisibilityPolicy.create(VisibilityPolicyEnum.PUBLIC);
    this.props.updatedAt = new Date();
  }
}
