import { MenuItem } from '../aggregates/menu-item.aggregate';
import { MenuItemTranslation } from '../entities/menu-item-translation.entity';

export class MenuItemConsistencySpecification {
  public static isSatisfiedBy(item: MenuItem): boolean {
    const allergenNames = item.allergens.map(a => a.allergenName);
    if (new Set(allergenNames).size !== allergenNames.length) return false;
    
    if (item.translations.length === 0) return false; // At least one supported language

    const locales = item.translations.map(t => t.languageCode);
    if (new Set(locales).size !== locales.length) return false; // No duplicate translations
    
    return true;
  }
}

export class CatalogReferenceSpecification {
  public static isSatisfiedBy(/* item: MenuItem */): boolean {
    return true; // Stub for valid external references
  }
}

export class NutritionSpecification {
  public static isValid(nutrition: any): boolean {
    return !nutrition || nutrition.calories >= 0;
  }
}

export class TranslationSpecification {
  public static isSatisfiedBy(translations: MenuItemTranslation[]): boolean {
    return translations.length > 0;
  }
}

export class AvailabilitySpecification {
  public static canBeAvailable(/* item: MenuItem */): boolean {
    // Has required refs
    return true;
  }
}