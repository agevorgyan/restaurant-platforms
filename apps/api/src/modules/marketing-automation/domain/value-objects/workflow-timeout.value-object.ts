import { ValueObject } from '@saas/core';

export interface WorkflowTimeoutProps {
  timeoutInSeconds: number;
}

export class WorkflowTimeout extends ValueObject<WorkflowTimeoutProps> {
  private constructor(props: WorkflowTimeoutProps) {
    super(props);
  }

  public static create(timeoutInSeconds: number): WorkflowTimeout {
    if (timeoutInSeconds <= 0) {
      throw new Error('Timeout must be strictly positive');
    }
    return new WorkflowTimeout({ timeoutInSeconds });
  }

  get timeoutInSeconds(): number {
    return this.props.timeoutInSeconds;
  }
}
