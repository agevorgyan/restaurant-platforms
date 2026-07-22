import { Entity } from '@saas/core';
import { Quantity } from '../value-objects/quantity.value-object';

export interface IngredientNutritionProps {
  id: string;
  ingredientId: string;
  servingSize: Quantity;
  calories: number;
  proteinGrams: number;
  fatGrams: number;
  carbohydrateGrams: number;
}

export class IngredientNutrition extends Entity<IngredientNutritionProps> {
  get id(): string {
    return this._id;
  }

  get servingSize(): Quantity {
    return this.props.servingSize;
  }

  get calories(): number {
    return this.props.calories;
  }

  get proteinGrams(): number {
    return this.props.proteinGrams;
  }

  get fatGrams(): number {
    return this.props.fatGrams;
  }

  get carbohydrateGrams(): number {
    return this.props.carbohydrateGrams;
  }

  public static create(props: IngredientNutritionProps): IngredientNutrition {
    if (props.calories < 0) {
      throw new Error('Calories cannot be negative');
    }
    
    if (props.proteinGrams < 0 || props.fatGrams < 0 || props.carbohydrateGrams < 0) {
      throw new Error('Macronutrients cannot be negative');
    }

    return new IngredientNutrition(props.id, props);
  }
}
