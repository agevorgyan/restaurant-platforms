import { RequisitionLine } from '../entities/purchase-requisition/requisition-line.entity';
import { RequesterInformation } from '../entities/purchase-requisition/requester-information.entity';
import { PurchaseRequisitionStatus, ApprovalStatus } from '../enums/procurement.enums';
import { ApprovalStep } from '../entities/purchase-requisition/approval-step.entity';
import { BudgetAllocation } from '../entities/purchase-requisition/budget-allocation.entity';

export class PurchaseRequisitionConsistencySpecification {
  public static canSubmit(
    status: PurchaseRequisitionStatus,
    lines: RequisitionLine[],
    requesterInfo?: RequesterInformation
  ): boolean {
    if (status !== PurchaseRequisitionStatus.DRAFT) return false;
    if (lines.length === 0) return false;
    if (!requesterInfo) return false;
    return true;
  }
}

export class ApprovalWorkflowSpecification {
  public static isFullyApproved(steps: ApprovalStep[]): boolean {
    if (steps.length === 0) return true; // Auto-approved if no steps
    return steps.every(s => s.status === ApprovalStatus.APPROVED);
  }

  public static isRejected(steps: ApprovalStep[]): boolean {
    return steps.some(s => s.status === ApprovalStatus.REJECTED);
  }
}

export class BudgetValidationSpecification {
  public static isWithinBudget(totalAmount: number, allocations: BudgetAllocation[]): boolean {
    if (allocations.length === 0) return true; // No budget constraints enforced here
    const totalAllocated = allocations.reduce((sum, a) => sum + a.allocatedAmount.amount, 0);
    return totalAmount <= totalAllocated;
  }
}

export class RequisitionLineSpecification {
  public static hasValidLines(lines: RequisitionLine[]): boolean {
    return lines.length > 0 && lines.every(l => l.quantity > 0);
  }
}
