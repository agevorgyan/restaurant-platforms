import { ApprovalPlan } from '../../value-objects/workflow/approval-plan.value-object';
import { PurchaseRequisition } from '../../aggregates/purchase-requisition.aggregate';

export class PurchaseApprovalEngine {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public evaluateApprovalPolicies(requisition: PurchaseRequisition): ApprovalPlan {
    // Generate approval plan based on requisition amount, department, etc.
    return ApprovalPlan.create({
      requiredApprovers: ['FINANCE_MANAGER'],
      timeoutHours: 48
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public resolveApprovalChain(plan: ApprovalPlan, requisition: PurchaseRequisition): void {
    // In a real system, this interacts with external routing or identity.
    // For DDD, it delegates actions back to the aggregate API:
    // e.g. requisition.submit(), requisition.approve()
  }
}