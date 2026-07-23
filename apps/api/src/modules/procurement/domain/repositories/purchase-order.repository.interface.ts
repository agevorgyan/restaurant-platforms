import { PurchaseOrderId } from '../value-objects/purchase-order-id.value-object';
import { PurchaseOrder } from '../aggregates/purchase-order.aggregate';

export interface PurchaseOrderRepository {
  findById(id: PurchaseOrderId): Promise<PurchaseOrder | null>;
  save(order: PurchaseOrder): Promise<void>;
  delete(id: PurchaseOrderId): Promise<void>;
}
