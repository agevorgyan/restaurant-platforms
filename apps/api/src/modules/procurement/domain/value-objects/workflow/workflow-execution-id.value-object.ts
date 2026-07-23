import { ValueObject } from '@saas/core';

export interface WorkflowExecutionIdProps { value: string; }

export class WorkflowExecutionId extends ValueObject<WorkflowExecutionIdProps> {
  get value(): string { return this.props.value; }
  private constructor(props: WorkflowExecutionIdProps) { super(props); }
  public static create(value?: string): WorkflowExecutionId {
    return new WorkflowExecutionId({ value: value || crypto.randomUUID() });
  }
}