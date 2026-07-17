export interface RecipeIngredientDto {
  ingredientId: string;
  quantity: number;
  unitOfMeasure: string;
  wasteFactor: number;
  optional: boolean;
  substituteIngredientIds: string[];
}

export interface CreateRecipeDto {
  restaurantId: string;
  menuItemId: string;
  name: string;
  yieldAmount: number;
  yieldUnit: string;
  portionSizeValue: number;
  portionSizeUnit: string;
  ingredients: RecipeIngredientDto[];
}

export interface UpdateRecipeDto {
  name?: string;
  yieldAmount?: number;
  yieldUnit?: string;
  portionSizeValue?: number;
  portionSizeUnit?: string;
  ingredients?: RecipeIngredientDto[];
}
