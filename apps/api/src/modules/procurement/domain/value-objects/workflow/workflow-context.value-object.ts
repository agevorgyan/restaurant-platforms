import { ValueObject } from '@saas/core';
import { WorkflowCorrelationId } from './workflow-correlation-id.value-object';
import { WorkflowExecutionId } from './workflow-execution-id.value-object';

export interface WorkflowContextProps {
  correlationId: WorkflowCorrelationId;
  executionId: WorkflowExecutionId;
  currentState: string;
  payload: Record<string, any>;
}

export class WorkflowContext extends ValueObject<WorkflowContextProps> {
  get correlationId(): WorkflowCorrelationId { return this.props.correlationId; }
  get executionId(): WorkflowExecutionId { return this.props.executionId; }
  get currentState(): string { return this.props.currentState; }
  get payload(): Record<string, any> { return this.props.payload; }

  private constructor(props: WorkflowContextProps) { super(props); }

  public static create(props: WorkflowContextProps): WorkflowContext {
    return new WorkflowContext(props);
  }

  public updateState(newState: string, extraPayload?: Record<string, any>): WorkflowContext {
    return new WorkflowContext({
      correlationId: this.props.correlationId,
      executionId: this.props.executionId,
      currentState: newState,
      payload: { ...this.props.payload, ...extraPayload }
    });
  }
}