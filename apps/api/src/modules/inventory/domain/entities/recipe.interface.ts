import { RecipeVersion } from '../value-objects/recipe-version.value-object';
import { RecipeYield } from '../value-objects/recipe-yield.value-object';
import { PortionSize } from '../value-objects/portion-size.value-object';
import { RecipeStatus } from '../value-objects/recipe-status.value-object';
import { IRecipeIngredient } from './recipe-ingredient.interface';

export interface IRecipe {
  id: string;
  restaurantId: string;
  menuItemId: string;
  name: string;
  version: RecipeVersion;
  yield: RecipeYield;
  portionSize: PortionSize;
  status: RecipeStatus;
  ingredients: IRecipeIngredient[];
  createdAt: Date;
  updatedAt: Date;
}
