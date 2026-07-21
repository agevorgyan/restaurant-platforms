import { AggregateRoot } from '@saas/core';
import { WorkflowId } from '../value-objects/workflow-id.value-object';
import { WorkflowName } from '../value-objects/workflow-name.value-object';
import { WorkflowStatus, WorkflowStatusEnum } from '../value-objects/workflow-status.value-object';
import { WorkflowPriority } from '../value-objects/workflow-priority.value-object';
import { WorkflowExecutionMode } from '../value-objects/workflow-execution-mode.value-object';
import { WorkflowTimeout } from '../value-objects/workflow-timeout.value-object';
import { WorkflowTrigger } from '../entities/workflow-trigger.entity';
import { WorkflowStep } from '../entities/workflow-step.entity';
import {
  WorkflowCreated,
  WorkflowActivated,
  WorkflowPaused,
  WorkflowResumed,
  WorkflowCancelled,
} from '../events/automation-workflow-events';

export interface AutomationWorkflowProps {
  id: WorkflowId;
  name: WorkflowName;
  status: WorkflowStatus;
  priority: WorkflowPriority;
  executionMode: WorkflowExecutionMode;
  timeout?: WorkflowTimeout;
  triggers: WorkflowTrigger[];
  steps: WorkflowStep[];
}

export class AutomationWorkflow extends AggregateRoot<AutomationWorkflowProps> {
  private constructor(props: AutomationWorkflowProps) {
    super(props.id.value, props);
  }

  public static create(
    id: WorkflowId,
    name: WorkflowName,
    priority: WorkflowPriority,
    executionMode: WorkflowExecutionMode,
    timeout?: WorkflowTimeout
  ): AutomationWorkflow {
    const workflow = new AutomationWorkflow({
      id,
      name,
      status: WorkflowStatus.initial(),
      priority,
      executionMode,
      timeout,
      triggers: [],
      steps: [],
    });

    workflow.addDomainEvent(new WorkflowCreated(id.value, name.value));

    return workflow;
  }

  get workflowId(): WorkflowId { return this.props.id; }
  get name(): WorkflowName { return this.props.name; }
  get status(): WorkflowStatus { return this.props.status; }
  get priority(): WorkflowPriority { return this.props.priority; }
  get executionMode(): WorkflowExecutionMode { return this.props.executionMode; }
  get timeout(): WorkflowTimeout | undefined { return this.props.timeout; }
  get triggers(): WorkflowTrigger[] { return [...this.props.triggers]; }
  get steps(): WorkflowStep[] { return [...this.props.steps]; }

  public addTrigger(trigger: WorkflowTrigger): void {
    if (this.props.status.isArchived()) {
      throw new Error('Cannot modify triggers of an archived workflow');
    }
    // Prevent duplicate triggers of same type
    if (this.props.triggers.some(t => t.type === trigger.type)) {
      throw new Error(`A trigger of type ${trigger.type} already exists`);
    }
    this.props.triggers.push(trigger);
  }

  public removeTrigger(triggerId: string): void {
    if (this.props.status.isArchived()) {
      throw new Error('Cannot modify triggers of an archived workflow');
    }
    this.props.triggers = this.props.triggers.filter(t => t.id !== triggerId);
  }

  public addStep(step: WorkflowStep): void {
    if (this.props.status.isArchived()) {
      throw new Error('Cannot modify steps of an archived workflow');
    }
    if (this.props.steps.some(s => s.id === step.id)) {
      throw new Error(`A step with id ${step.id} already exists`);
    }
    this.props.steps.push(step);
    
    // Auto-validate graph when step is added
    if (this.hasCycles()) {
      this.props.steps = this.props.steps.filter(s => s.id !== step.id);
      throw new Error('Adding this step would create a cyclic dependency in the workflow graph');
    }
  }

  public removeStep(stepId: string): void {
    if (this.props.status.isArchived()) {
      throw new Error('Cannot modify steps of an archived workflow');
    }
    this.props.steps = this.props.steps.filter(s => s.id !== stepId);
    
    // Remove references to this step from other steps
    this.props.steps.forEach(s => s.removeNextStep(stepId));
  }

  public activate(): void {
    if (this.props.status.isActive()) {
      throw new Error('Workflow is already active');
    }
    if (this.props.status.isArchived()) {
      throw new Error('Cannot activate an archived workflow');
    }
    if (this.props.triggers.length === 0) {
      throw new Error('Workflow must contain at least one trigger to be activated');
    }
    if (this.props.steps.filter(s => !!s.action).length === 0) {
      throw new Error('Workflow must contain at least one action step to be activated');
    }
    if (this.hasCycles()) {
      throw new Error('Workflow contains cyclic dependencies');
    }

    this.props.status = WorkflowStatus.create(WorkflowStatusEnum.ACTIVE);
    this.addDomainEvent(new WorkflowActivated(this.id));
  }

  public pause(reason?: string): void {
    if (!this.props.status.isActive()) {
      throw new Error('Only active workflows can be paused');
    }
    this.props.status = WorkflowStatus.create(WorkflowStatusEnum.PAUSED);
    this.addDomainEvent(new WorkflowPaused(this.id, reason));
  }

  public resume(): void {
    if (!this.props.status.isPaused()) {
      throw new Error('Only paused workflows can be resumed');
    }
    this.props.status = WorkflowStatus.create(WorkflowStatusEnum.ACTIVE);
    this.addDomainEvent(new WorkflowResumed(this.id));
  }

  public archive(reason?: string): void {
    if (this.props.status.isArchived()) return;
    
    this.props.status = WorkflowStatus.create(WorkflowStatusEnum.ARCHIVED);
    this.addDomainEvent(new WorkflowCancelled(this.id, reason));
  }

  /**
   * Helper method to detect cycles in the workflow steps graph using DFS
   */
  private hasCycles(): boolean {
    const visited = new Set<string>();
    const recursionStack = new Set<string>();
    
    const stepMap = new Map<string, WorkflowStep>();
    this.props.steps.forEach(s => stepMap.set(s.id, s));

    const checkCycle = (nodeId: string): boolean => {
      if (recursionStack.has(nodeId)) return true;
      if (visited.has(nodeId)) return false;

      visited.add(nodeId);
      recursionStack.add(nodeId);

      const step = stepMap.get(nodeId);
      if (step) {
        for (const nextId of step.nextStepIds) {
          if (checkCycle(nextId)) return true;
        }
      }

      recursionStack.delete(nodeId);
      return false;
    };

    for (const step of this.props.steps) {
      if (checkCycle(step.id)) return true;
    }

    return false;
  }
}
