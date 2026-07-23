import { PurchaseRequisitionId } from '../value-objects/purchase-requisition-id.value-object';
import { PurchaseRequisition } from '../aggregates/purchase-requisition.aggregate';

export interface PurchaseRequisitionRepository {
  findById(id: PurchaseRequisitionId): Promise<PurchaseRequisition | null>;
  save(requisition: PurchaseRequisition): Promise<void>;
  delete(id: PurchaseRequisitionId): Promise<void>;
}
