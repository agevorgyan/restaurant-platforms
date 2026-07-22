import { Ingredient } from '../aggregates/ingredient.aggregate';
import { IngredientStatusEnum } from '../value-objects/ingredient-status.value-object';

export class IngredientLifecyclePolicy {
  public static activate(ingredient: Ingredient): void {
    if (ingredient.status.value === IngredientStatusEnum.ACTIVE) {
      return;
    }
    
    if (ingredient.status.value === IngredientStatusEnum.ARCHIVED) {
      throw new Error('Cannot activate an archived ingredient');
    }
    
    if (ingredient.status.value === IngredientStatusEnum.DISCONTINUED) {
      throw new Error('Cannot activate a discontinued ingredient');
    }

    ingredient.activate();
  }

  public static archive(ingredient: Ingredient): void {
    if (ingredient.status.value === IngredientStatusEnum.ARCHIVED) {
      return;
    }

    ingredient.archive();
  }

  public static discontinue(ingredient: Ingredient): void {
    if (ingredient.status.value === IngredientStatusEnum.DISCONTINUED) {
      return;
    }

    ingredient.discontinue();
  }
}
