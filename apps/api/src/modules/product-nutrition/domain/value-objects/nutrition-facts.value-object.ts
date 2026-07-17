import { NutritionValue } from './nutrition-value.value-object';
import { ServingInformation } from './serving-information.value-object';

export class NutritionFacts {
  constructor(
    public readonly servingInformation: ServingInformation,
    public readonly calories: NutritionValue,
    public readonly protein?: NutritionValue,
    public readonly fat?: NutritionValue,
    public readonly saturatedFat?: NutritionValue,
    public readonly transFat?: NutritionValue,
    public readonly carbohydrates?: NutritionValue,
    public readonly sugar?: NutritionValue,
    public readonly fiber?: NutritionValue,
    public readonly salt?: NutritionValue,
    public readonly sodium?: NutritionValue,
    public readonly cholesterol?: NutritionValue,
  ) {
    this.validate();
  }

  private validate(): void {
    if (this.calories.value < 0) {
      throw new Error('Calories must be zero or greater');
    }
  }
}
