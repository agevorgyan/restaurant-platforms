import { Ingredient } from '../aggregates/ingredient.aggregate';

export interface IIngredientRepository {
  save(ingredient: Ingredient): Promise<void>;
  findById(id: string, restaurantId: string): Promise<Ingredient | null>;
  findBySku(sku: string, restaurantId: string): Promise<Ingredient | null>;
  findByCode(code: string, restaurantId: string): Promise<Ingredient | null>;
}
