import { CreateIngredientDto, UpdateIngredientDto } from '../dto/ingredient.dto';

export const validateCreateIngredient = (dto: CreateIngredientDto): string[] => {
  const errors: string[] = [];
  if (!dto.restaurantId) errors.push('restaurantId is required');
  if (!dto.ingredientCode || dto.ingredientCode.trim() === '') errors.push('Ingredient code must not be empty');
  if (!dto.name || dto.name.trim() === '') errors.push('Ingredient name must not be empty');
  if (!dto.category) errors.push('category is required');
  if (!dto.unitOfMeasure) errors.push('unitOfMeasure is required');
  if (!dto.defaultStorageCondition) errors.push('defaultStorageCondition is required');
  if (typeof dto.defaultShelfLife !== 'number' || dto.defaultShelfLife <= 0) errors.push('Shelf life must be greater than zero');
  if (dto.allergens !== undefined && !Array.isArray(dto.allergens)) errors.push('Allergens must be an array of strings');
  return errors;
};

export const validateUpdateIngredient = (dto: UpdateIngredientDto): string[] => {
  const errors: string[] = [];
  if (dto.name !== undefined && dto.name.trim() === '') errors.push('Ingredient name must not be empty');
  if (dto.defaultShelfLife !== undefined && (typeof dto.defaultShelfLife !== 'number' || dto.defaultShelfLife <= 0)) {
    errors.push('Shelf life must be greater than zero');
  }
  if (dto.allergens !== undefined && !Array.isArray(dto.allergens)) errors.push('Allergens must be an array of strings');
  return errors;
};
