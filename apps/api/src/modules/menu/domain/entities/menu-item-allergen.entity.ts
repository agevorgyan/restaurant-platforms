import { Entity } from '@saas/core';

export interface MenuItemAllergenProps {
  id: string;
  allergenName: string;
  contains: boolean;
}

export class MenuItemAllergen extends Entity<MenuItemAllergenProps> {
  get allergenName(): string { return this.props.allergenName; }
  get contains(): boolean { return this.props.contains; }

  private constructor(props: MenuItemAllergenProps) { super(props.id, props); }

  public static create(props: MenuItemAllergenProps): MenuItemAllergen {
    if (!props.allergenName) throw new Error('Allergen name cannot be empty');
    return new MenuItemAllergen(props);
  }
}