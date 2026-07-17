import { ITaxPolicy } from '../entities/tax-policy.interface';

export interface ITaxRepository {
  findById(id: string): Promise<ITaxPolicy | null>;
  findDefaultByRestaurantId(restaurantId: string): Promise<ITaxPolicy | null>;
  create(taxPolicy: ITaxPolicy): Promise<ITaxPolicy>;
  update(id: string, updates: Partial<ITaxPolicy>): Promise<ITaxPolicy>;
}
