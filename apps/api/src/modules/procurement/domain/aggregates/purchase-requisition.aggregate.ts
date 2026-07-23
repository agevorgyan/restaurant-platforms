import { AggregateRoot } from '@saas/core';
import { PurchaseRequisitionId } from '../value-objects/purchase-requisition-id.value-object';
import { PurchaseRequisitionNumber } from '../value-objects/purchase-requisition/purchase-requisition-number.value-object';
import { PurchaseRequisitionStatus } from '../enums/procurement.enums';
import { RequisitionPriority } from '../value-objects/purchase-requisition/requisition-priority.value-object';
import { RequisitionReason } from '../value-objects/purchase-requisition/requisition-reason.value-object';
import { RequestedDeliveryDate } from '../value-objects/purchase-requisition/requested-delivery-date.value-object';
import { RequisitionLine } from '../entities/purchase-requisition/requisition-line.entity';
import { ApprovalStep } from '../entities/purchase-requisition/approval-step.entity';
import { RequesterInformation } from '../entities/purchase-requisition/requester-information.entity';
import { BudgetAllocation } from '../entities/purchase-requisition/budget-allocation.entity';
import { RequisitionComment } from '../entities/purchase-requisition/requisition-comment.entity';
import { PurchaseRequisitionVersion } from '../value-objects/purchase-requisition/purchase-requisition-version.value-object';
import { 
  PurchaseRequisitionCreatedEvent,
  PurchaseRequisitionSubmittedEvent,
  PurchaseRequisitionApprovedEvent,
  PurchaseRequisitionRejectedEvent,
  PurchaseRequisitionCancelledEvent,
  PurchaseRequisitionConvertedToPurchaseOrderEvent,
  RequisitionLineAddedEvent,
  RequisitionLineRemovedEvent
} from '../events/purchase-requisition.events';
import { PurchaseRequisitionLifecyclePolicy, RequisitionValidationPolicy } from '../policies/purchase-requisition.policy';

export interface PurchaseRequisitionProps {
  number: PurchaseRequisitionNumber;
  status: PurchaseRequisitionStatus;
  priority: RequisitionPriority;
  reason?: RequisitionReason;
  requestedDeliveryDate?: RequestedDeliveryDate;
  
  requesterInfo?: RequesterInformation;
  
  lines: RequisitionLine[];
  approvalSteps: ApprovalStep[];
  budgetAllocations: BudgetAllocation[];
  comments: RequisitionComment[];

  version: PurchaseRequisitionVersion;
  
  createdAt: Date;
  updatedAt: Date;
}

export class PurchaseRequisition extends AggregateRoot<PurchaseRequisitionProps> {
  get number(): PurchaseRequisitionNumber { return this.props.number; }
  get status(): PurchaseRequisitionStatus { return this.props.status; }
  get priority(): RequisitionPriority { return this.props.priority; }
  get reason(): RequisitionReason | undefined { return this.props.reason; }
  get requestedDeliveryDate(): RequestedDeliveryDate | undefined { return this.props.requestedDeliveryDate; }
  get requesterInfo(): RequesterInformation | undefined { return this.props.requesterInfo; }
  get lines(): RequisitionLine[] { return [...this.props.lines]; }
  get approvalSteps(): ApprovalStep[] { return [...this.props.approvalSteps]; }
  get budgetAllocations(): BudgetAllocation[] { return [...this.props.budgetAllocations]; }
  get comments(): RequisitionComment[] { return [...this.props.comments]; }
  get version(): PurchaseRequisitionVersion { return this.props.version; }

  private constructor(props: PurchaseRequisitionProps, id?: string) {
    super(id || crypto.randomUUID(), props);
  }

  public static create(
    number: PurchaseRequisitionNumber,
    priority: RequisitionPriority = RequisitionPriority.default()
  ): PurchaseRequisition {
    const id = PurchaseRequisitionId.generate().value;
    const pr = new PurchaseRequisition({
      number,
      status: PurchaseRequisitionStatus.DRAFT,
      priority,
      lines: [],
      approvalSteps: [],
      budgetAllocations: [],
      comments: [],
      version: PurchaseRequisitionVersion.initial(),
      createdAt: new Date(),
      updatedAt: new Date()
    }, id);

    pr.addDomainEvent(new PurchaseRequisitionCreatedEvent(id));
    return pr;
  }

  public updateNumber(newNumber: PurchaseRequisitionNumber): void {
    const isSubmitted = this.props.status !== PurchaseRequisitionStatus.DRAFT;
    RequisitionValidationPolicy.ensureNumberImmutable(isSubmitted, newNumber.value, this.props.number.value);
    this.props.number = newNumber;
    this.markModified();
  }

  public setRequesterInformation(info: RequesterInformation): void {
    PurchaseRequisitionLifecyclePolicy.ensureModifiable(this.props.status);
    this.props.requesterInfo = info;
    this.markModified();
  }

  public addLine(line: RequisitionLine): void {
    PurchaseRequisitionLifecyclePolicy.ensureModifiable(this.props.status);
    this.props.lines.push(line);
    this.markModified();
    this.addDomainEvent(new RequisitionLineAddedEvent(this._id, line.id));
  }

  public removeLine(lineId: string): void {
    PurchaseRequisitionLifecyclePolicy.ensureModifiable(this.props.status);
    this.props.lines = this.props.lines.filter(l => l.id !== lineId);
    this.markModified();
    this.addDomainEvent(new RequisitionLineRemovedEvent(this._id, lineId));
  }

  public submit(): void {
    PurchaseRequisitionLifecyclePolicy.ensureCanSubmit(this.props.status, this.props.lines, this.props.requesterInfo);
    this.props.status = PurchaseRequisitionStatus.SUBMITTED;
    this.markModified();
    this.addDomainEvent(new PurchaseRequisitionSubmittedEvent(this._id, this.props.number.value));
  }

  public approve(): void {
    PurchaseRequisitionLifecyclePolicy.ensureCanApproveOrReject(this.props.status);
    this.props.status = PurchaseRequisitionStatus.APPROVED;
    this.markModified();
    this.addDomainEvent(new PurchaseRequisitionApprovedEvent(this._id));
  }

  public reject(reason: string): void {
    PurchaseRequisitionLifecyclePolicy.ensureCanApproveOrReject(this.props.status);
    this.props.status = PurchaseRequisitionStatus.REJECTED;
    this.markModified();
    this.addDomainEvent(new PurchaseRequisitionRejectedEvent(this._id, reason));
  }

  public convertToPurchaseOrder(purchaseOrderId: string): void {
    PurchaseRequisitionLifecyclePolicy.ensureCanConvert(this.props.status);
    this.props.status = PurchaseRequisitionStatus.CONVERTED_TO_PO;
    this.markModified();
    this.addDomainEvent(new PurchaseRequisitionConvertedToPurchaseOrderEvent(this._id, purchaseOrderId));
  }

  public cancel(): void {
    PurchaseRequisitionLifecyclePolicy.ensureCanCancel(this.props.status);
    this.props.status = PurchaseRequisitionStatus.CANCELLED;
    this.markModified();
    this.addDomainEvent(new PurchaseRequisitionCancelledEvent(this._id));
  }

  private markModified(): void {
    this.props.updatedAt = new Date();
    this.props.version = this.props.version.increment();
  }
}
