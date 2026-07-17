import { IngredientQuantity } from '../value-objects/ingredient-quantity.value-object';
import { WasteFactor } from '../value-objects/waste-factor.value-object';

export interface IRecipeIngredient {
  ingredientId: string;
  quantity: IngredientQuantity;
  unitOfMeasure: string;
  wasteFactor: WasteFactor;
  optional: boolean;
  substituteIngredientIds: string[];
}
