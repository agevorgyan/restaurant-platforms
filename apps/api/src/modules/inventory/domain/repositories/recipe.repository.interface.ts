import { IRecipe } from '../entities/recipe.interface';

export interface IRecipeRepository {
  findById(id: string): Promise<IRecipe | null>;
  findActiveByMenuItemId(menuItemId: string): Promise<IRecipe | null>;
  save(recipe: IRecipe): Promise<void>;
}
