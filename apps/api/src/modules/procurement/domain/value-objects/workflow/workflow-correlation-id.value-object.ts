import { ValueObject } from '@saas/core';

export interface WorkflowCorrelationIdProps { value: string; }

export class WorkflowCorrelationId extends ValueObject<WorkflowCorrelationIdProps> {
  get value(): string { return this.props.value; }
  private constructor(props: WorkflowCorrelationIdProps) { super(props); }
  public static create(value?: string): WorkflowCorrelationId {
    return new WorkflowCorrelationId({ value: value || crypto.randomUUID() });
  }
}