import { AggregateRoot } from '@saas/domain';
import { 
  PayrollAdjustmentId, 
  AdjustmentNumber, 
  AdjustmentType, 
  AdjustmentReason, 
  AdjustmentAmount, 
  EffectiveDate, 
  AdjustmentApprovalStatus, 
  AdjustmentApprovalStatusEnum,
  AdjustmentStatus,
  AdjustmentStatusEnum
} from '../value-objects/payroll-adjustment-core';
import { EmployeeReference } from '../value-objects/employee-payroll-core';
import { Currency } from '../value-objects/currency';
import { AdjustmentLine } from '../entities/adjustment-line';
import { ApprovalRecord } from '../entities/approval-record';
import { AdjustmentAttachment } from '../entities/adjustment-attachment';
import { PayrollAuditEntry } from '../entities/payroll-audit-entry';
import {
  PayrollAdjustmentCreated,
  PayrollAdjustmentUpdated,
  PayrollAdjustmentApproved,
  PayrollAdjustmentRejected,
  PayrollAdjustmentCancelled,
  PayrollAdjustmentApplied,
  PayrollAdjustmentArchived
} from '../events/adjustment-events';

export class PayrollAdjustment extends AggregateRoot<PayrollAdjustmentId> {
  private _status: AdjustmentStatus;
  private _approvalStatus: AdjustmentApprovalStatus;
  private _amount: AdjustmentAmount;
  private _lines: AdjustmentLine[] = [];
  private _approvalRecords: ApprovalRecord[] = [];
  private _attachments: AdjustmentAttachment[] = [];
  private _auditTrail: PayrollAuditEntry[] = [];

  constructor(
    id: PayrollAdjustmentId,
    public readonly adjustmentNumber: AdjustmentNumber,
    public readonly employeeReference: EmployeeReference,
    public readonly type: AdjustmentType,
    public readonly reason: AdjustmentReason,
    amount: AdjustmentAmount,
    public readonly currency: Currency,
    public readonly effectiveDate: EffectiveDate,
    status: AdjustmentStatus = AdjustmentStatus.create(AdjustmentStatusEnum.DRAFT),
    approvalStatus: AdjustmentApprovalStatus = AdjustmentApprovalStatus.create(AdjustmentApprovalStatusEnum.PENDING)
  ) {
    super(id);
    this._status = status;
    this._approvalStatus = approvalStatus;
    this._amount = amount;
  }

  public static create(
    adjustmentNumber: AdjustmentNumber,
    employeeReference: EmployeeReference,
    type: AdjustmentType,
    reason: AdjustmentReason,
    amount: AdjustmentAmount,
    currency: Currency,
    effectiveDate: EffectiveDate
  ): PayrollAdjustment {
    const id = PayrollAdjustmentId.generate();
    const adjustment = new PayrollAdjustment(
      id, adjustmentNumber, employeeReference, type, reason, amount, currency, effectiveDate
    );
    
    adjustment.record(new PayrollAdjustmentCreated(id.toValue(), adjustment.version(), {
      adjustmentId: id.toValue(),
      employeeReference: employeeReference.toValue()
    }));

    adjustment.addAuditEntry('CREATED', 'SYSTEM', 'Payroll adjustment initialized');
    return adjustment;
  }

  get status(): AdjustmentStatus { return this._status; }
  get approvalStatus(): AdjustmentApprovalStatus { return this._approvalStatus; }
  get amount(): AdjustmentAmount { return this._amount; }
  get lines(): AdjustmentLine[] { return [...this._lines]; }
  get approvalRecords(): ApprovalRecord[] { return [...this._approvalRecords]; }
  get attachments(): AdjustmentAttachment[] { return [...this._attachments]; }
  get auditTrail(): PayrollAuditEntry[] { return [...this._auditTrail]; }

  private addAuditEntry(action: string, performedBy: string, details: string): void {
    this._auditTrail.push(PayrollAuditEntry.create(action, performedBy, details));
  }

  private ensureModifiable(): void {
    const currentStatus = this._status.toValue();
    if (currentStatus === AdjustmentStatusEnum.APPLIED) throw new Error('Applied adjustments cannot be modified.');
    if (currentStatus === AdjustmentStatusEnum.CANCELLED) throw new Error('Cancelled adjustments cannot be modified.');
    if (currentStatus === AdjustmentStatusEnum.ARCHIVED) throw new Error('Archived adjustments cannot be modified.');
  }

  public modify(newAmount: AdjustmentAmount, newReason: AdjustmentReason, userId: string): void {
    this.ensureModifiable();
    if (this._approvalStatus.toValue() === AdjustmentApprovalStatusEnum.APPROVED) {
      throw new Error('Approved adjustments must be un-approved before modification.');
    }

    this._amount = newAmount;
    // this._reason = newReason; // would need to drop readonly or recreate

    this.record(new PayrollAdjustmentUpdated(this.id.toValue(), this.version(), {
      adjustmentId: this.id.toValue()
    }));

    this.addAuditEntry('UPDATED', userId, `Modified amount to ${newAmount.toValue()}`);
  }

  public submitForApproval(userId: string): void {
    this.ensureModifiable();
    this._status = AdjustmentStatus.create(AdjustmentStatusEnum.SUBMITTED);
    this.addAuditEntry('SUBMITTED', userId, 'Submitted for approval');
  }

  public approve(userId: string): void {
    if (this._status.toValue() !== AdjustmentStatusEnum.SUBMITTED) {
      throw new Error('Only submitted adjustments can be approved.');
    }

    if (this._approvalStatus.toValue() === AdjustmentApprovalStatusEnum.REJECTED) {
      throw new Error('Rejected adjustments must be resubmitted before approval.');
    }

    this._approvalStatus = AdjustmentApprovalStatus.create(AdjustmentApprovalStatusEnum.APPROVED);
    this._status = AdjustmentStatus.create(AdjustmentStatusEnum.APPROVED);
    this._approvalRecords.push(ApprovalRecord.create(userId, true, 'Approved'));

    this.record(new PayrollAdjustmentApproved(this.id.toValue(), this.version(), {
      adjustmentId: this.id.toValue(),
      approvedBy: userId
    }));

    this.addAuditEntry('APPROVED', userId, 'Adjustment approved');
  }

  public reject(userId: string, reason: string): void {
    if (this._status.toValue() !== AdjustmentStatusEnum.SUBMITTED) {
      throw new Error('Only submitted adjustments can be rejected.');
    }

    this._approvalStatus = AdjustmentApprovalStatus.create(AdjustmentApprovalStatusEnum.REJECTED);
    this._status = AdjustmentStatus.create(AdjustmentStatusEnum.DRAFT); // Send back to draft
    this._approvalRecords.push(ApprovalRecord.create(userId, false, reason));

    this.record(new PayrollAdjustmentRejected(this.id.toValue(), this.version(), {
      adjustmentId: this.id.toValue(),
      rejectedBy: userId,
      reason
    }));

    this.addAuditEntry('REJECTED', userId, `Adjustment rejected: ${reason}`);
  }

  public cancel(userId: string): void {
    if (this._status.toValue() === AdjustmentStatusEnum.APPLIED) {
      throw new Error('Applied adjustments cannot be cancelled.');
    }

    this._status = AdjustmentStatus.create(AdjustmentStatusEnum.CANCELLED);

    this.record(new PayrollAdjustmentCancelled(this.id.toValue(), this.version(), {
      adjustmentId: this.id.toValue(),
      cancelledBy: userId
    }));

    this.addAuditEntry('CANCELLED', userId, 'Adjustment cancelled');
  }

  public apply(userId: string): void {
    if (this._status.toValue() === AdjustmentStatusEnum.CANCELLED) {
      throw new Error('Cancelled adjustments cannot be applied.');
    }

    if (this._approvalStatus.toValue() !== AdjustmentApprovalStatusEnum.APPROVED) {
      throw new Error('Adjustment must be approved before application.');
    }

    this._status = AdjustmentStatus.create(AdjustmentStatusEnum.APPLIED);

    this.record(new PayrollAdjustmentApplied(this.id.toValue(), this.version(), {
      adjustmentId: this.id.toValue()
    }));

    this.addAuditEntry('APPLIED', userId, 'Adjustment applied to payroll');
  }

  public archive(userId: string): void {
    if (this._status.toValue() === AdjustmentStatusEnum.ARCHIVED) return;
    
    this._status = AdjustmentStatus.create(AdjustmentStatusEnum.ARCHIVED);

    this.record(new PayrollAdjustmentArchived(this.id.toValue(), this.version(), {
      adjustmentId: this.id.toValue()
    }));

    this.addAuditEntry('ARCHIVED', userId, 'Adjustment archived');
  }
}
