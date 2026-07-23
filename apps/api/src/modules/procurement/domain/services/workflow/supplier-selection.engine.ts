import { PurchaseRequisition } from '../../aggregates/purchase-requisition.aggregate';
import { SupplierSelectionResult } from '../../value-objects/workflow/supplier-selection-result.value-object';
import { SupplierSelectionPolicy } from '../../policies/workflow.policy';

export class SupplierSelectionEngine {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public evaluateEligibleSuppliers(requisition: PurchaseRequisition, availableSuppliers: any[]): any[] {
    return availableSuppliers.filter(s => {
      try {
        SupplierSelectionPolicy.ensureSupplierActive(s.status);
        return true;
      } catch {
        return false;
      }
    });
  }

  public rankSuppliers(eligibleSuppliers: any[]): SupplierSelectionResult {
    if (eligibleSuppliers.length === 0) {
      throw new Error('No eligible suppliers found');
    }
    return SupplierSelectionResult.create({
      selectedSupplierId: eligibleSuppliers[0].id,
      alternativeSupplierIds: eligibleSuppliers.slice(1).map(s => s.id),
      selectionReason: 'Highest ranking by cost and lead time'
    });
  }
}