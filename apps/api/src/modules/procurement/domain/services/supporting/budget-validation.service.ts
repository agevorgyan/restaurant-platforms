import { PurchaseRequisition } from '../../aggregates/purchase-requisition.aggregate';

export class BudgetValidationService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async validateBudget(requisition: PurchaseRequisition): Promise<boolean> {
    // Connects to external budgeting systems or policies
    return true;
  }
}