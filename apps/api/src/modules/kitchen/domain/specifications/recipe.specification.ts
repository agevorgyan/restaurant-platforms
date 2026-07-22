import { RecipeIngredient } from '../entities/recipe-ingredient.entity';
import { RecipeStep } from '../entities/recipe-step.entity';

export class RecipeIngredientSpecification {
  public static isSatisfiedBy(
    ingredients: RecipeIngredient[],
    newIngredient: RecipeIngredient
  ): boolean {
    // Cannot have duplicates based on the external ingredient reference
    const exists = ingredients.some(
      (i) => i.ingredient.externalId === newIngredient.ingredient.externalId
    );
    return !exists;
  }
}

export class RecipeStepSpecification {
  public static isSatisfiedBy(
    steps: RecipeStep[],
    newStep: RecipeStep
  ): boolean {
    // Step number must be unique
    const exists = steps.some((s) => s.stepNumber === newStep.stepNumber);
    return !exists;
  }
}

export class RecipeConsistencySpecification {
  public static isSatisfiedBy(
    ingredients: RecipeIngredient[],
    steps: RecipeStep[]
  ): boolean {
    // Recipe is only consistent if there are no duplicate step numbers
    const stepNumbers = steps.map((s) => s.stepNumber);
    const uniqueSteps = new Set(stepNumbers);
    if (uniqueSteps.size !== stepNumbers.length) {
      return false;
    }

    // Recipe is only consistent if there are no duplicate ingredients
    const ingredientIds = ingredients.map((i) => i.ingredient.externalId);
    const uniqueIngredients = new Set(ingredientIds);
    if (uniqueIngredients.size !== ingredientIds.length) {
      return false;
    }

    return true;
  }
}
