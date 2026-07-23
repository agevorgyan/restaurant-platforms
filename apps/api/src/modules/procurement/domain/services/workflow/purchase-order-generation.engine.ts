import { PurchaseRequisition } from '../../aggregates/purchase-requisition.aggregate';
import { PurchaseOrderGenerationSpecification } from '../../specifications/workflow.specifications';

export class PurchaseOrderGenerationEngine {
  public validatePrerequisites(requisition: PurchaseRequisition): void {
    if (!PurchaseOrderGenerationSpecification.isSatisfiedBy(requisition.status as unknown as string)) {
      throw new Error('Approval required before Purchase Order generation');
    }
  }

  public generatePurchaseOrderRequest(requisition: PurchaseRequisition, supplierId: string): any {
    this.validatePrerequisites(requisition);
    // Acts as a domain service orchestrating the generation without mutating state directly
    // Returning data necessary to create a PO via its factory
    return {
      requisitionId: requisition.id,
      supplierId: supplierId,
      // mapping lines, etc.
    };
  }
}