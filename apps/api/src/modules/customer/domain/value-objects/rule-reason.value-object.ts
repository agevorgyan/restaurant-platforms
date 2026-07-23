import { ValueObject } from '@saas/core';

export interface RuleReasonProps { code: string; message: string; }

export class RuleReason extends ValueObject<RuleReasonProps> {
  get code(): string { return this.props.code; }
  get message(): string { return this.props.message; }
  private constructor(props: RuleReasonProps) { super(props); }
  public static create(code: string, message: string): RuleReason {
    return new RuleReason({ code, message });
  }
}