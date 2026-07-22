import { Ingredient } from '../aggregates/ingredient.aggregate';
import { IngredientStatusEnum } from '../value-objects/ingredient-status.value-object';
import { IngredientConsistencySpecification } from '../specifications/ingredient-consistency.specification';

export class IngredientValidationPolicy {
  public static validate(ingredient: Ingredient): void {
    if (ingredient.status.value === IngredientStatusEnum.ACTIVE) {
      if (!ingredient.unitOfMeasure) {
        throw new Error('Active ingredient must have a default unit of measure');
      }
    }

    // Basic invariant validations
    IngredientConsistencySpecification.isSatisfiedBy(ingredient);
  }
}
