import { Entity } from '@saas/core';

export interface MenuItemNutritionProps {
  id: string;
  calories?: number;
  proteinGrams?: number;
  fatGrams?: number;
  carbsGrams?: number;
}

export class MenuItemNutrition extends Entity<MenuItemNutritionProps> {
  get calories(): number | undefined { return this.props.calories; }
  
  private constructor(props: MenuItemNutritionProps) { super(props.id, props); }

  public static create(props: MenuItemNutritionProps): MenuItemNutrition {
    if (props.calories !== undefined && props.calories < 0) {
      throw new Error('Calories cannot be negative');
    }
    return new MenuItemNutrition(props);
  }
}