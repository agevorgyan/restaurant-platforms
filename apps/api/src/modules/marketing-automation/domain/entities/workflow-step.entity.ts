import { Entity } from '@saas/core';
import { WorkflowAction } from './workflow-action.entity';
import { WorkflowCondition } from './workflow-condition.entity';

export interface WorkflowStepProps {
  name: string;
  action?: WorkflowAction;
  condition?: WorkflowCondition;
  nextStepIds: string[]; // Edges in the workflow graph
}

export class WorkflowStep extends Entity<WorkflowStepProps> {
  private constructor(id: string, props: WorkflowStepProps) {
    super(id, props);
  }

  public static createActionStep(id: string, name: string, action: WorkflowAction, nextStepIds: string[] = []): WorkflowStep {
    if (!name || name.trim().length === 0) {
      throw new Error('Step name cannot be empty');
    }
    return new WorkflowStep(id, { name, action, nextStepIds });
  }

  public static createConditionStep(id: string, name: string, condition: WorkflowCondition, nextStepIds: string[] = []): WorkflowStep {
    if (!name || name.trim().length === 0) {
      throw new Error('Step name cannot be empty');
    }
    return new WorkflowStep(id, { name, condition, nextStepIds });
  }

  get name(): string { return this.props.name; }
  get action(): WorkflowAction | undefined { return this.props.action; }
  get condition(): WorkflowCondition | undefined { return this.props.condition; }
  get nextStepIds(): string[] { return [...this.props.nextStepIds]; }

  public addNextStep(stepId: string): void {
    if (!this.props.nextStepIds.includes(stepId)) {
      this.props.nextStepIds.push(stepId);
    }
  }

  public removeNextStep(stepId: string): void {
    this.props.nextStepIds = this.props.nextStepIds.filter(id => id !== stepId);
  }
}
