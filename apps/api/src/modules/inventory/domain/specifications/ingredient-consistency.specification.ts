import { Ingredient } from '../aggregates/ingredient.aggregate';
import { IngredientStatusEnum } from '../value-objects/ingredient-status.value-object';

export class IngredientConsistencySpecification {
  public static isSatisfiedBy(ingredient: Ingredient): boolean {
    if (ingredient.status.value === IngredientStatusEnum.ACTIVE) {
      // Must have at least one supplier if active
      if (ingredient.suppliers.length === 0) {
        throw new Error('Active ingredient must have at least one supplier');
      }
    }
    return true;
  }
}
