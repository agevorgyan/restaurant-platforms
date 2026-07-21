import { ValueObject } from '@saas/core';

export interface WorkflowPriorityProps {
  value: number;
}

export class WorkflowPriority extends ValueObject<WorkflowPriorityProps> {
  private constructor(props: WorkflowPriorityProps) {
    super(props);
  }

  public static create(value: number): WorkflowPriority {
    if (value < 0) {
      throw new Error('Workflow priority cannot be negative');
    }
    return new WorkflowPriority({ value });
  }

  get value(): number {
    return this.props.value;
  }
}
