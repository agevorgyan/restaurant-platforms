import {
  WorkflowId,
  WorkflowVersion,
  WorkflowDefinition,
  WorkflowInstanceId,
  WorkflowState,
} from '../value-objects';
import { WorkflowStatus } from '../enums/workflow.enums';

export class Workflow {
  constructor(
    public readonly id: WorkflowId,
    public readonly version: WorkflowVersion,
    public readonly definition: WorkflowDefinition,
    public status: WorkflowStatus = WorkflowStatus.Draft,
    public readonly createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
  ) {}

  public publish(): void {
    if (this.status === WorkflowStatus.Published) {
      throw new Error('Workflow is already published.');
    }
    this.status = WorkflowStatus.Published;
    this.updatedAt = new Date();
  }
}

export class WorkflowInstance {
  private _timeline: Array<{ event: string; at: Date }> = [];

  constructor(
    public readonly id: WorkflowInstanceId,
    public readonly workflowId: WorkflowId,
    public readonly version: WorkflowVersion,
    public status: WorkflowStatus,
    public state: WorkflowState,
    public readonly startedAt: Date = new Date(),
    public updatedAt: Date = new Date(),
  ) {
    this._timeline.push({ event: 'Instance started', at: this.startedAt });
  }

  public pause(): void {
    if (this.status !== WorkflowStatus.Running) {
      throw new Error('Can only pause running workflow instances.');
    }
    this.status = WorkflowStatus.Paused;
    this._timeline.push({ event: 'Instance paused', at: new Date() });
    this.updatedAt = new Date();
  }

  public resume(): void {
    if (this.status !== WorkflowStatus.Paused) {
      throw new Error('Can only resume paused workflow instances.');
    }
    this.status = WorkflowStatus.Running;
    this._timeline.push({ event: 'Instance resumed', at: new Date() });
    this.updatedAt = new Date();
  }

  public complete(finalState: WorkflowState): void {
    this.status = WorkflowStatus.Completed;
    this.state = finalState;
    this._timeline.push({ event: 'Instance completed', at: new Date() });
    this.updatedAt = new Date();
  }

  public fail(reason: string): void {
    this.status = WorkflowStatus.Failed;
    this._timeline.push({ event: `Instance failed: ${reason}`, at: new Date() });
    this.updatedAt = new Date();
  }

  public cancel(): void {
    this.status = WorkflowStatus.Cancelled;
    this._timeline.push({ event: 'Instance cancelled', at: new Date() });
    this.updatedAt = new Date();
  }

  public compensate(): void {
    this.status = WorkflowStatus.Compensating;
    this._timeline.push({ event: 'Compensation initiated', at: new Date() });
    this.updatedAt = new Date();
  }

  get timeline(): ReadonlyArray<{ event: string; at: Date }> {
    return this._timeline;
  }
}
