import { ValueObject } from '@saas/core';

export interface AssignmentReasonProps { reason: string; }
export class AssignmentReason extends ValueObject<AssignmentReasonProps> {
  get reason(): string { return this.props.reason; }
  private constructor(props: AssignmentReasonProps) { super(props); }
  public static create(reason: string): AssignmentReason { return new AssignmentReason({ reason }); }
}