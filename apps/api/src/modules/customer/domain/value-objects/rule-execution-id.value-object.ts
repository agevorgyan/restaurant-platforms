import { ValueObject } from '@saas/core';

export interface RuleExecutionIdProps { value: string; }

export class RuleExecutionId extends ValueObject<RuleExecutionIdProps> {
  get value(): string { return this.props.value; }
  private constructor(props: RuleExecutionIdProps) { super(props); }
  public static create(value?: string): RuleExecutionId {
    return new RuleExecutionId({ value: value || crypto.randomUUID() });
  }
}