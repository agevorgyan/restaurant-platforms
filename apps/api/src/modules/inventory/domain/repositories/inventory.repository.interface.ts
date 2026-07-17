import { IInventory } from '../entities/inventory.interface';

export interface IInventoryRepository {
  findById(id: string): Promise<IInventory | null>;
  findByCodeAndRestaurantId(code: string, restaurantId: string): Promise<IInventory | null>;
  save(inventory: IInventory): Promise<void>;
}
