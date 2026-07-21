import { ValueObject } from '@saas/core';

export enum WorkflowStatusEnum {
  DRAFT = 'Draft',
  ACTIVE = 'Active',
  PAUSED = 'Paused',
  ARCHIVED = 'Archived',
}

export interface WorkflowStatusProps {
  value: WorkflowStatusEnum;
}

export class WorkflowStatus extends ValueObject<WorkflowStatusProps> {
  private constructor(props: WorkflowStatusProps) {
    super(props);
  }

  public static initial(): WorkflowStatus {
    return new WorkflowStatus({ value: WorkflowStatusEnum.DRAFT });
  }

  public static create(value: WorkflowStatusEnum): WorkflowStatus {
    return new WorkflowStatus({ value });
  }

  get value(): WorkflowStatusEnum {
    return this.props.value;
  }

  public isDraft(): boolean {
    return this.props.value === WorkflowStatusEnum.DRAFT;
  }

  public isActive(): boolean {
    return this.props.value === WorkflowStatusEnum.ACTIVE;
  }

  public isPaused(): boolean {
    return this.props.value === WorkflowStatusEnum.PAUSED;
  }

  public isArchived(): boolean {
    return this.props.value === WorkflowStatusEnum.ARCHIVED;
  }
}
