import { RecipeStatusEnum } from '../value-objects/recipe-status.value-object';
import { RecipeIngredient } from '../entities/recipe-ingredient.entity';
import { RecipeStep } from '../entities/recipe-step.entity';
import { RecipeConsistencySpecification } from '../specifications/recipe.specification';

export class RecipeLifecyclePolicy {
  public static canActivate(
    ingredients: RecipeIngredient[],
    steps: RecipeStep[]
  ): boolean {
    if (ingredients.length === 0) {
      throw new Error('Cannot activate a recipe without ingredients');
    }

    if (steps.length === 0) {
      throw new Error('Cannot activate a recipe without preparation steps');
    }

    if (!RecipeConsistencySpecification.isSatisfiedBy(ingredients, steps)) {
      throw new Error('Recipe state is inconsistent and cannot be activated');
    }

    return true;
  }
}

export class RecipeValidationPolicy {
  public static validate(
    status: RecipeStatusEnum,
    ingredients: RecipeIngredient[],
    steps: RecipeStep[]
  ): void {
    if (status === RecipeStatusEnum.ACTIVE) {
      RecipeLifecyclePolicy.canActivate(ingredients, steps);
    }
  }
}
