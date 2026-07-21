import { ValueObject } from '@saas/core';

export enum DelayUnit {
  MINUTES = 'minutes',
  HOURS = 'hours',
  DAYS = 'days',
  WEEKS = 'weeks',
}

export interface WorkflowDelayProps {
  duration: number;
  unit: DelayUnit;
}

export class WorkflowDelay extends ValueObject<WorkflowDelayProps> {
  private constructor(props: WorkflowDelayProps) {
    super(props);
  }

  public static create(duration: number, unit: DelayUnit): WorkflowDelay {
    if (duration <= 0) {
      throw new Error('Delay duration must be greater than zero');
    }
    return new WorkflowDelay({ duration, unit });
  }

  get duration(): number {
    return this.props.duration;
  }

  get unit(): DelayUnit {
    return this.props.unit;
  }
}
