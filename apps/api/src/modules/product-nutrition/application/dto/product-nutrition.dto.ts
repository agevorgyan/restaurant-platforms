export class NutritionValueDto {
  value: number;
  unit: string;
}

export class ServingInformationDto {
  servingSize: number;
  servingsPerContainer: number;
  measurementUnit: string;
}

export class NutritionFactsDto {
  servingInformation: ServingInformationDto;
  calories: NutritionValueDto;
  protein?: NutritionValueDto;
  fat?: NutritionValueDto;
  saturatedFat?: NutritionValueDto;
  transFat?: NutritionValueDto;
  carbohydrates?: NutritionValueDto;
  sugar?: NutritionValueDto;
  fiber?: NutritionValueDto;
  salt?: NutritionValueDto;
  sodium?: NutritionValueDto;
  cholesterol?: NutritionValueDto;
}

export class UpdateProductNutritionDto {
  productId: string;
  nutritionFacts?: NutritionFactsDto;
  allergens?: string[];
  dietaryTags?: string[];
}
