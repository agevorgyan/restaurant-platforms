import { Injectable } from '@nestjs/common';
import { IBranchRepository, IBranch } from '../../domain';

@Injectable()
export class InMemoryBranchRepository implements IBranchRepository {
  private readonly branches: Map<string, IBranch> = new Map();

  async findById(id: string): Promise<IBranch | null> {
    return this.branches.get(id) || null;
  }

  async findByRestaurantId(restaurantId: string): Promise<IBranch[]> {
    const results: IBranch[] = [];
    for (const branch of this.branches.values()) {
      if (branch.restaurantId === restaurantId) {
        results.push(branch);
      }
    }
    return results;
  }

  async save(branch: IBranch): Promise<IBranch> {
    this.branches.set(branch.id, branch);
    return branch;
  }

  async delete(id: string): Promise<boolean> {
    return this.branches.delete(id);
  }
}
