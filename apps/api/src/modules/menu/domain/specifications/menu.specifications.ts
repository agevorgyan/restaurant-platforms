export class MenuSpecification {
  public static isSatisfiedBy(menu: any): boolean {
    return !!menu;
  }
}

export class MenuItemSpecification {
  public static isSatisfiedBy(item: any): boolean {
    return !!item;
  }
}

export class CategorySpecification {
  public static isSatisfiedBy(category: any): boolean {
    return !!category;
  }
}

export class ModifierSpecification {
  public static isSatisfiedBy(modifier: any): boolean {
    return !!modifier;
  }
}