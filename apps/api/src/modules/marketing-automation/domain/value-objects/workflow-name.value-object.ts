import { ValueObject } from '@saas/core';

export interface WorkflowNameProps {
  value: string;
}

export class WorkflowName extends ValueObject<WorkflowNameProps> {
  private constructor(props: WorkflowNameProps) {
    super(props);
  }

  public static create(value: string): WorkflowName {
    if (!value || value.trim().length === 0) {
      throw new Error('Workflow name cannot be empty');
    }
    return new WorkflowName({ value });
  }

  get value(): string {
    return this.props.value;
  }
}
