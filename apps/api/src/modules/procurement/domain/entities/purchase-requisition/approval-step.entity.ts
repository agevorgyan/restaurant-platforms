import { Entity } from '@saas/core';
import { ApprovalLevel } from '../../value-objects/purchase-requisition/approval-level.value-object';
import { ApprovedBy } from '../../value-objects/purchase-requisition/approved-by.value-object';
import { ApprovalStatus } from '../../enums/procurement.enums';

export interface ApprovalStepProps {
  level: ApprovalLevel;
  status: ApprovalStatus;
  approvedBy?: ApprovedBy;
  comments?: string;
  assignedRoleOrUser: string;
}

export class ApprovalStep extends Entity<ApprovalStepProps> {
  get level(): ApprovalLevel { return this.props.level; }
  get status(): ApprovalStatus { return this.props.status; }
  get approvedBy(): ApprovedBy | undefined { return this.props.approvedBy; }
  get comments(): string | undefined { return this.props.comments; }
  get assignedRoleOrUser(): string { return this.props.assignedRoleOrUser; }

  private constructor(id: string, props: ApprovalStepProps) {
    super(id, props);
  }

  public static create(props: Omit<ApprovalStepProps, 'status'>, id?: string): ApprovalStep {
    if (!props.assignedRoleOrUser || props.assignedRoleOrUser.trim() === '') {
      throw new Error('Approval step must be assigned to a role or user');
    }

    return new ApprovalStep(id || crypto.randomUUID(), {
      ...props,
      status: ApprovalStatus.PENDING
    });
  }

  public approve(approver: ApprovedBy, comments?: string): void {
    if (this.props.status !== ApprovalStatus.PENDING && this.props.status !== ApprovalStatus.REQUESTED_CHANGES) {
      throw new Error('Can only approve pending steps');
    }
    this.props.status = ApprovalStatus.APPROVED;
    this.props.approvedBy = approver;
    if (comments) this.props.comments = comments;
  }

  public reject(comments: string): void {
    if (this.props.status !== ApprovalStatus.PENDING) {
      throw new Error('Can only reject pending steps');
    }
    if (!comments || comments.trim() === '') {
      throw new Error('Rejection requires comments');
    }
    this.props.status = ApprovalStatus.REJECTED;
    this.props.comments = comments;
  }
}
