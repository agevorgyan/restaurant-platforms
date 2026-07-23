import { MenuItem } from '../aggregates/menu-item.aggregate';
import { MenuItemLifecycleStatus } from '../enums/menu-item.enums';

export class MenuItemLifecyclePolicy {
  public static canPublish(item: MenuItem): boolean {
    if (item.status !== MenuItemLifecycleStatus.DRAFT) return false;
    if (item.translations.length === 0) return false;
    return true;
  }

  public static canMakeAvailable(item: MenuItem): boolean {
    return item.status === MenuItemLifecycleStatus.PUBLISHED || item.status === MenuItemLifecycleStatus.UNAVAILABLE;
  }
}

export class CatalogValidationPolicy {
  public static validateSku(sku: any): void {
    if (!sku) throw new Error('SKU uniqueness enforced externally, but must be present');
  }
}

export class AvailabilityPolicy {
  public static checkOverrides(item: MenuItem, locationId: string): boolean {
    const override = item.availabilityOverrides.find(o => o.locationId === locationId);
    return override ? override.isAvailable : item.status === MenuItemLifecycleStatus.AVAILABLE;
  }
}

export class TranslationPolicy {
  public static validateSupportedLanguage(languageCode: string): void {
    if (!languageCode) throw new Error('Language code required');
  }
}