import { ValueObject } from '@saas/core';

export enum WorkflowExecutionModeEnum {
  SEQUENTIAL = 'Sequential',
  PARALLEL = 'Parallel',
}

export interface WorkflowExecutionModeProps {
  value: WorkflowExecutionModeEnum;
}

export class WorkflowExecutionMode extends ValueObject<WorkflowExecutionModeProps> {
  private constructor(props: WorkflowExecutionModeProps) {
    super(props);
  }

  public static create(value: WorkflowExecutionModeEnum): WorkflowExecutionMode {
    return new WorkflowExecutionMode({ value });
  }

  get value(): WorkflowExecutionModeEnum {
    return this.props.value;
  }
}
