import { UpdateProductNutritionDto } from '../dto/product-nutrition.dto';

export const validateUpdateProductNutrition = (dto: UpdateProductNutritionDto): string[] => {
  const errors: string[] = [];
  
  if (!dto.productId) errors.push('productId is required');

  if (dto.allergens) {
    const uniqueAllergens = new Set(dto.allergens);
    if (uniqueAllergens.size !== dto.allergens.length) {
      errors.push('Duplicate allergens are not allowed');
    }
  }

  if (dto.dietaryTags) {
    const uniqueTags = new Set(dto.dietaryTags);
    if (uniqueTags.size !== dto.dietaryTags.length) {
      errors.push('Duplicate dietary tags are not allowed');
    }
  }

  return errors;
};
