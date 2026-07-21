import { ValueObject } from '@saas/core';

export interface WorkflowIdProps {
  value: string;
}

export class WorkflowId extends ValueObject<WorkflowIdProps> {
  private constructor(props: WorkflowIdProps) {
    super(props);
  }

  public static create(value: string): WorkflowId {
    if (!value || value.trim().length === 0) {
      throw new Error('WorkflowId cannot be empty');
    }
    return new WorkflowId({ value });
  }

  get value(): string {
    return this.props.value;
  }
}
