import { IBranch } from '../entities';

export interface IBranchRepository {
  findById(id: string): Promise<IBranch | null>;
  findByRestaurantId(restaurantId: string): Promise<IBranch[]>;
  save(branch: IBranch): Promise<IBranch>;
  delete(id: string): Promise<boolean>;
}
