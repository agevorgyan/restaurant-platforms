import { Menu } from '../aggregates/menu.aggregate';
import { MenuStatus } from '../enums/menu.enums';

export class MenuConsistencySpecification {
  public static isSatisfiedBy(menu: Menu): boolean {
    // Unique category names
    const names = menu.categories.map(c => c.name.value);
    const uniqueNames = new Set(names);
    if (names.length !== uniqueNames.size) return false;
    
    // Check sections inside categories
    for (const cat of menu.categories) {
      const secNames = cat.sections.map(s => s.name.value);
      if (secNames.length !== new Set(secNames).size) return false;
    }
    return true;
  }
}

export class MenuVisibilitySpecification {
  public static isVisible(menu: Menu): boolean {
    return menu.status === MenuStatus.PUBLISHED || menu.status === MenuStatus.ACTIVE;
  }
}

export class MenuLayoutSpecification {
  public static isValid(layout: any): boolean {
    return !!layout;
  }
}

export class CategorySpecification {
  public static isValid(category: any): boolean {
    // Category cannot be empty
    return category && category.sections && category.sections.length > 0;
  }
}

export class SectionSpecification {
  public static isValid(section: any): boolean {
    return section && section.displayOrder.order >= 0;
  }
}