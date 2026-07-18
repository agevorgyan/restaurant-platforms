import { IPurchaseReturn } from '../entities/purchase-return.interface';

export interface IPurchaseReturnRepository {
  findById(id: string): Promise<IPurchaseReturn | null>;
  findByReturnNumber(restaurantId: string, returnNumber: string): Promise<IPurchaseReturn | null>;
  save(purchaseReturn: IPurchaseReturn): Promise<void>;
}
