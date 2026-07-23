import { ValueObject } from '@saas/core';

export interface RequisitionReasonProps {
  reason: string;
}

export class RequisitionReason extends ValueObject<RequisitionReasonProps> {
  get reason(): string {
    return this.props.reason;
  }

  private constructor(props: RequisitionReasonProps) {
    super(props);
  }

  public static create(reason: string): RequisitionReason {
    if (!reason || reason.trim().length < 5) {
      throw new Error('Requisition reason must be at least 5 characters');
    }
    return new RequisitionReason({ reason: reason.trim() });
  }
}
