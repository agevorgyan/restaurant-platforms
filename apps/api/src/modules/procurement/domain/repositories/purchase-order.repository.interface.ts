import { PurchaseOrderId } from '../value-objects/purchase-order-id.value-object';

export interface PurchaseOrderRepository {
  findById(id: PurchaseOrderId): Promise<any | null>;
  save(order: any): Promise<void>;
  delete(id: PurchaseOrderId): Promise<void>;
}
