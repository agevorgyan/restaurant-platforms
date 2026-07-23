import { ValueObject } from '@saas/core';
import { WorkflowCorrelationId } from './workflow-correlation-id.value-object';

export interface WorkflowRequestProps {
  requisitionId: string;
  correlationId: WorkflowCorrelationId;
  requestedBy: string;
  metadata?: Record<string, any>;
}

export class WorkflowRequest extends ValueObject<WorkflowRequestProps> {
  get requisitionId(): string { return this.props.requisitionId; }
  get correlationId(): WorkflowCorrelationId { return this.props.correlationId; }
  get requestedBy(): string { return this.props.requestedBy; }
  get metadata(): Record<string, any> | undefined { return this.props.metadata; }

  private constructor(props: WorkflowRequestProps) { super(props); }

  public static create(props: WorkflowRequestProps): WorkflowRequest {
    if (!props.requisitionId) throw new Error('RequisitionId is required');
    if (!props.requestedBy) throw new Error('RequestedBy is required');
    return new WorkflowRequest(props);
  }
}