import { Inventory } from '../aggregates/inventory.aggregate';

export interface IInventoryRepository {
  findById(id: string): Promise<Inventory | null>;
  findByIngredientAndLocation(ingredientId: string, locationId: string): Promise<Inventory | null>;
  save(inventory: Inventory): Promise<void>;
}
