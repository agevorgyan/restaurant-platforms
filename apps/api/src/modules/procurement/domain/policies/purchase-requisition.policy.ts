import { PurchaseRequisitionStatus } from '../enums/procurement.enums';
import { PurchaseRequisitionDomainError } from '../errors/procurement.errors';
import { RequisitionLine } from '../entities/purchase-requisition/requisition-line.entity';
import { RequesterInformation } from '../entities/purchase-requisition/requester-information.entity';
import { PurchaseRequisitionConsistencySpecification, RequisitionLineSpecification } from '../specifications/purchase-requisition.specification';

export class PurchaseRequisitionLifecyclePolicy {
  public static ensureCanSubmit(
    status: PurchaseRequisitionStatus,
    lines: RequisitionLine[],
    requesterInfo?: RequesterInformation
  ): void {
    if (!PurchaseRequisitionConsistencySpecification.canSubmit(status, lines, requesterInfo)) {
      throw new PurchaseRequisitionDomainError('Cannot submit requisition: must be in DRAFT state, have at least one line, and have requester information.');
    }
    if (!RequisitionLineSpecification.hasValidLines(lines)) {
      throw new PurchaseRequisitionDomainError('All requisition lines must have a positive quantity.');
    }
  }

  public static ensureCanApproveOrReject(status: PurchaseRequisitionStatus): void {
    if (status !== PurchaseRequisitionStatus.SUBMITTED && status !== PurchaseRequisitionStatus.PENDING_APPROVAL) {
      throw new PurchaseRequisitionDomainError('Only submitted or pending requisitions can be approved/rejected.');
    }
  }

  public static ensureCanConvert(status: PurchaseRequisitionStatus): void {
    if (status !== PurchaseRequisitionStatus.APPROVED) {
      throw new PurchaseRequisitionDomainError('Requisition must be approved before conversion.');
    }
  }

  public static ensureCanCancel(status: PurchaseRequisitionStatus): void {
    if (status === PurchaseRequisitionStatus.CONVERTED_TO_PO || status === PurchaseRequisitionStatus.CLOSED) {
      throw new PurchaseRequisitionDomainError('Cannot cancel a converted or closed requisition.');
    }
  }

  public static ensureModifiable(status: PurchaseRequisitionStatus): void {
    if (
      status === PurchaseRequisitionStatus.CONVERTED_TO_PO ||
      status === PurchaseRequisitionStatus.CLOSED ||
      status === PurchaseRequisitionStatus.CANCELLED
    ) {
      throw new PurchaseRequisitionDomainError('Requisition cannot be modified in its current state.');
    }
  }
}

export class ApprovalPolicy {
  // Can be extended with more complex role-based or threshold-based approval policies
}

export class BudgetPolicy {
  // Can be extended with strict budget checks
}

export class RequisitionValidationPolicy {
  public static ensureNumberImmutable(isSubmitted: boolean, newNumber: string, oldNumber: string): void {
    if (isSubmitted && newNumber !== oldNumber) {
      throw new PurchaseRequisitionDomainError('Purchase Requisition Number is immutable after submission.');
    }
  }
}
