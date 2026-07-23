import { ValueObject } from '@saas/core';

export interface RulePriorityProps { level: number; }

export class RulePriority extends ValueObject<RulePriorityProps> {
  get level(): number { return this.props.level; }
  private constructor(props: RulePriorityProps) { super(props); }
  public static create(level: number): RulePriority {
    return new RulePriority({ level });
  }
}