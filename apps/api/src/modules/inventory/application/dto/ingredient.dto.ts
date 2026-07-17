export interface CreateIngredientDto {
  restaurantId: string;
  ingredientCode: string;
  name: string;
  description?: string;
  category: string;
  unitOfMeasure: string;
  defaultStorageCondition: string;
  defaultShelfLife: number;
  allergens?: string[];
  barcode?: string;
}

export interface UpdateIngredientDto {
  name?: string;
  description?: string;
  category?: string;
  defaultStorageCondition?: string;
  defaultShelfLife?: number;
  allergens?: string[];
  barcode?: string;
}
