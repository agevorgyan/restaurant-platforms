import { MediaAsset } from '../aggregates';
import { MaximumMediaSize, SupportedMediaType } from '../specifications';
import { MediaTypeEnum } from '../value-objects';

export class MediaValidationService {
  public validateForUpload(type: MediaTypeEnum, sizeBytes: number): void {
    if (!SupportedMediaType.isSatisfiedBy(type)) {
      throw new Error(`Media type ${type} is not supported`);
    }

    if (!MaximumMediaSize.isSatisfiedBy(sizeBytes)) {
      throw new Error(`Media size ${sizeBytes} exceeds maximum allowed size`);
    }
  }
}

export class MediaIntegrityService {
  public verifyChecksum(asset: MediaAsset, computedChecksum: string): boolean {
    return asset.props.checksum.toValue() === computedChecksum;
  }
}

export class MediaLifecycleService {
  public archiveStaleMedia(assets: MediaAsset[]): void {
    assets.forEach(asset => {
      // In production, would evaluate retention policy dates
      asset.archive();
    });
  }
}

export class MediaStorageService {
  // Acts as domain abstraction over Storage Provider Framework specifically for Media
  public async generateUploadUrl(asset: MediaAsset): Promise<string> {
    // Generate signed URL via SecureAccessPlatform
    return `https://s3.example.com/${asset.storageKey}?signature=...`;
  }

  public async generateDeliveryUrl(asset: MediaAsset): Promise<string> {
    // Generate CDN edge URL (CloudFront, Cloudflare)
    return `https://cdn.restaurant.com/media/${asset.storageKey}`;
  }
}
