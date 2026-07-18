import { IPurchaseOrder } from '../entities/purchase-order.interface';

export interface IPurchaseOrderRepository {
  findById(id: string): Promise<IPurchaseOrder | null>;
  findByOrderNumber(restaurantId: string, purchaseOrderNumber: string): Promise<IPurchaseOrder | null>;
  save(purchaseOrder: IPurchaseOrder): Promise<void>;
}
