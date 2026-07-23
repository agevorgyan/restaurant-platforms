import { ValueObject } from '@saas/core';

export interface ApprovalPlanProps {
  requiredApprovers: string[];
  escalationPath?: string[];
  timeoutHours: number;
}

export class ApprovalPlan extends ValueObject<ApprovalPlanProps> {
  get requiredApprovers(): string[] { return [...this.props.requiredApprovers]; }
  get escalationPath(): string[] | undefined { return this.props.escalationPath ? [...this.props.escalationPath] : undefined; }
  get timeoutHours(): number { return this.props.timeoutHours; }

  private constructor(props: ApprovalPlanProps) { super(props); }

  public static create(props: ApprovalPlanProps): ApprovalPlan {
    if (props.requiredApprovers.length === 0) throw new Error('Approval plan must have at least one approver');
    return new ApprovalPlan(props);
  }
}