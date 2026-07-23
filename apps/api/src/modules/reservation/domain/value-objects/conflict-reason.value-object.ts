import { ValueObject } from '@saas/core';

export interface ConflictReasonProps { reason: string; }
export class ConflictReason extends ValueObject<ConflictReasonProps> {
  get reason(): string { return this.props.reason; }
  private constructor(props: ConflictReasonProps) { super(props); }
  public static create(reason: string): ConflictReason { return new ConflictReason({ reason }); }
}