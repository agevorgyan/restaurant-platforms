import { Entity, Identifier } from '@saas/domain';
import { StaffId } from '../value-objects/staff-id';
import { ApprovalStatus } from '../value-objects/approval-status';

export class ApprovalDecisionId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): ApprovalDecisionId { return new ApprovalDecisionId(value); }
  public static generate(): ApprovalDecisionId { return new ApprovalDecisionId(crypto.randomUUID()); }
}

export class ApprovalDecision extends Entity<ApprovalDecisionId> {
  constructor(
    id: ApprovalDecisionId,
    public readonly approverId: StaffId,
    public readonly decision: ApprovalStatus,
    public readonly reason: string,
    public readonly timestamp: Date
  ) {
    super(id);
  }

  public static create(approverId: StaffId, decision: ApprovalStatus, reason: string): ApprovalDecision {
    return new ApprovalDecision(ApprovalDecisionId.generate(), approverId, decision, reason, new Date());
  }
}
