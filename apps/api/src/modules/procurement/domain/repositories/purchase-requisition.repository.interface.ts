import { PurchaseRequisitionId } from '../value-objects/purchase-requisition-id.value-object';

export interface PurchaseRequisitionRepository {
  findById(id: PurchaseRequisitionId): Promise<any | null>;
  save(requisition: any): Promise<void>;
  delete(id: PurchaseRequisitionId): Promise<void>;
}
