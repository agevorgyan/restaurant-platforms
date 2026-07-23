export class MenuPolicy {
  public static canPublish(menu: any): boolean {
    return !!menu;
  }
}

export class AvailabilityPolicy {
  public static isAvailable(item: any): boolean {
    return !!item;
  }
}

export class VisibilityPolicy {
  public static isVisible(item: any): boolean {
    return !!item;
  }
}

export class CatalogPolicy {
  public static isValidCatalogReference(reference: any): boolean {
    return !!reference;
  }
}