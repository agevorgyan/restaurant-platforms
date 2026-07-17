import { NutritionFacts } from '../value-objects/nutrition-facts.value-object';
import { Allergen } from '../value-objects/allergen.value-object';
import { DietaryTag } from '../value-objects/dietary-tag.value-object';

export class ProductNutritionUpdatedEvent {
  constructor(
    public readonly productId: string,
    public readonly nutritionFacts: NutritionFacts | undefined,
    public readonly allergens: Allergen[],
    public readonly dietaryTags: DietaryTag[]
  ) {}
}
