import { ValueObject } from '@saas/core';
import { WorkflowExecutionId } from './workflow-execution-id.value-object';

export enum WorkflowOutcome { SUCCESS = 'SUCCESS', FAILURE = 'FAILURE', PARTIAL = 'PARTIAL' }

export interface WorkflowResultProps {
  executionId: WorkflowExecutionId;
  outcome: WorkflowOutcome;
  completedAt: Date;
  details?: string;
}

export class WorkflowResult extends ValueObject<WorkflowResultProps> {
  get executionId(): WorkflowExecutionId { return this.props.executionId; }
  get outcome(): WorkflowOutcome { return this.props.outcome; }
  get completedAt(): Date { return this.props.completedAt; }
  get details(): string | undefined { return this.props.details; }

  private constructor(props: WorkflowResultProps) { super(props); }

  public static create(props: WorkflowResultProps): WorkflowResult {
    return new WorkflowResult({ ...props, completedAt: props.completedAt || new Date() });
  }
}