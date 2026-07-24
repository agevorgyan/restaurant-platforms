import { MediaAsset } from '../aggregates';
import { MediaTypeEnum, VisibilityPolicyEnum, MediaStatusEnum } from '../value-objects';

export class SupportedMediaType {
  private static readonly allowedTypes = [
    MediaTypeEnum.IMAGE,
    MediaTypeEnum.VIDEO,
    MediaTypeEnum.AUDIO,
    MediaTypeEnum.ANIMATION,
    MediaTypeEnum.VECTOR
  ];

  public static isSatisfiedBy(type: MediaTypeEnum): boolean {
    return this.allowedTypes.includes(type);
  }
}

export class MaximumMediaSize {
  private static readonly maxBytes = 1024 * 1024 * 500; // 500 MB

  public static isSatisfiedBy(sizeBytes: number): boolean {
    return sizeBytes <= this.maxBytes;
  }
}

export class TenantOwnership {
  public static isSatisfiedBy(asset: MediaAsset, tenantId: string): boolean {
    return asset.tenantId.toValue() === tenantId;
  }
}

export class MediaAvailability {
  public static isSatisfiedBy(asset: MediaAsset, requesterTenantId: string): boolean {
    if (asset.status.toValue() !== MediaStatusEnum.AVAILABLE) {
      return false;
    }
    
    if (asset.visibility.toValue() === VisibilityPolicyEnum.PUBLIC) {
      return true;
    }
    
    return asset.tenantId.toValue() === requesterTenantId;
  }
}
