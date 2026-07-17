import { CreateRecipeDto, UpdateRecipeDto, RecipeIngredientDto } from '../dto/recipe.dto';

const validateIngredient = (ing: RecipeIngredientDto, index: number): string[] => {
  const errors: string[] = [];
  if (!ing.ingredientId) errors.push(`Ingredient [${index}]: ingredientId is required`);
  if (typeof ing.quantity !== 'number' || ing.quantity <= 0) errors.push(`Ingredient [${index}]: quantity must be greater than zero`);
  if (!ing.unitOfMeasure) errors.push(`Ingredient [${index}]: unitOfMeasure is required`);
  if (typeof ing.wasteFactor !== 'number' || ing.wasteFactor < 0 || ing.wasteFactor > 100) {
    errors.push(`Ingredient [${index}]: wasteFactor must be between 0 and 100`);
  }
  if (!Array.isArray(ing.substituteIngredientIds)) {
    errors.push(`Ingredient [${index}]: substituteIngredientIds must be an array`);
  }
  return errors;
};

export const validateCreateRecipe = (dto: CreateRecipeDto): string[] => {
  const errors: string[] = [];
  if (!dto.restaurantId) errors.push('restaurantId is required');
  if (!dto.menuItemId) errors.push('menuItemId is required');
  if (!dto.name || dto.name.trim() === '') errors.push('Recipe name must not be empty');
  
  if (typeof dto.yieldAmount !== 'number' || dto.yieldAmount <= 0) errors.push('Yield amount must be greater than zero');
  if (!dto.yieldUnit || dto.yieldUnit.trim() === '') errors.push('Yield unit must be specified');
  
  if (typeof dto.portionSizeValue !== 'number' || dto.portionSizeValue <= 0) errors.push('Portion size value must be greater than zero');
  if (!dto.portionSizeUnit || dto.portionSizeUnit.trim() === '') errors.push('Portion size unit must be specified');

  if (!Array.isArray(dto.ingredients) || dto.ingredients.length === 0) {
    errors.push('Recipe must contain at least one ingredient');
  } else {
    dto.ingredients.forEach((ing, index) => {
      errors.push(...validateIngredient(ing, index));
    });

    const ingredientIds = dto.ingredients.map(i => i.ingredientId);
    if (new Set(ingredientIds).size !== ingredientIds.length) {
      errors.push('Duplicate ingredients are not allowed within the same recipe');
    }
  }

  return errors;
};

export const validateUpdateRecipe = (dto: UpdateRecipeDto): string[] => {
  const errors: string[] = [];
  
  if (dto.name !== undefined && dto.name.trim() === '') errors.push('Recipe name must not be empty');
  
  if (dto.yieldAmount !== undefined && (typeof dto.yieldAmount !== 'number' || dto.yieldAmount <= 0)) {
    errors.push('Yield amount must be greater than zero');
  }
  if (dto.yieldUnit !== undefined && dto.yieldUnit.trim() === '') {
    errors.push('Yield unit must be specified');
  }
  
  if (dto.portionSizeValue !== undefined && (typeof dto.portionSizeValue !== 'number' || dto.portionSizeValue <= 0)) {
    errors.push('Portion size value must be greater than zero');
  }
  if (dto.portionSizeUnit !== undefined && dto.portionSizeUnit.trim() === '') {
    errors.push('Portion size unit must be specified');
  }

  if (dto.ingredients !== undefined) {
    if (!Array.isArray(dto.ingredients) || dto.ingredients.length === 0) {
      errors.push('Recipe must contain at least one ingredient');
    } else {
      dto.ingredients.forEach((ing, index) => {
        errors.push(...validateIngredient(ing, index));
      });
      const ingredientIds = dto.ingredients.map(i => i.ingredientId);
      if (new Set(ingredientIds).size !== ingredientIds.length) {
        errors.push('Duplicate ingredients are not allowed within the same recipe');
      }
    }
  }

  return errors;
};
