import { ValueObject } from '@saas/core';

export interface WorkflowScheduleProps {
  cronExpression?: string;
  runAt?: Date;
}

export class WorkflowSchedule extends ValueObject<WorkflowScheduleProps> {
  private constructor(props: WorkflowScheduleProps) {
    super(props);
  }

  public static create(props: WorkflowScheduleProps): WorkflowSchedule {
    if (!props.cronExpression && !props.runAt) {
      throw new Error('A schedule must define either a cron expression or a specific run date');
    }
    if (props.runAt && props.runAt < new Date()) {
      throw new Error('Scheduled run date cannot be in the past');
    }
    return new WorkflowSchedule(props);
  }

  get cronExpression(): string | undefined {
    return this.props.cronExpression;
  }

  get runAt(): Date | undefined {
    return this.props.runAt;
  }
}
