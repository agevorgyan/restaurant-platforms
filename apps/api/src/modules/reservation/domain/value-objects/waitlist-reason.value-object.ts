import { ValueObject } from '@saas/core';

export interface WaitlistReasonProps { reason: string; }
export class WaitlistReason extends ValueObject<WaitlistReasonProps> {
  get reason(): string { return this.props.reason; }
  private constructor(props: WaitlistReasonProps) { super(props); }
  public static create(reason: string): WaitlistReason { return new WaitlistReason({ reason }); }
}