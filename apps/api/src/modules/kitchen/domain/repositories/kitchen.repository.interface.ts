import { IKitchen } from '../entities/kitchen.interface';

export interface IKitchenRepository {
  findById(id: string): Promise<IKitchen | null>;
  findByNameAndBranchId(name: string, branchId: string): Promise<IKitchen | null>;
  findDefaultByBranchId(branchId: string): Promise<IKitchen | null>;
  save(kitchen: IKitchen): Promise<void>;
}
