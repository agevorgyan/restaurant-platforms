import { Recipe } from '../aggregates/recipe.aggregate';

export interface RecipeRepository {
  findById(id: string): Promise<Recipe | null>;
  findByCode(code: string): Promise<Recipe | null>;
  save(recipe: Recipe): Promise<void>;
}
