import { IIngredient } from '../entities/ingredient.interface';

export interface IIngredientRepository {
  findById(id: string): Promise<IIngredient | null>;
  findByCodeAndRestaurantId(code: string, restaurantId: string): Promise<IIngredient | null>;
  findByBarcode(barcode: string): Promise<IIngredient | null>;
  save(ingredient: IIngredient): Promise<void>;
}
