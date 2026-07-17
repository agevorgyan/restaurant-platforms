import { Injectable, ConflictException } from '@nestjs/common';
import { IKitchenWorkflow } from '../entities/kitchen-workflow.interface';
import { KitchenWorkflowState, KitchenWorkflowStateType } from '../value-objects/kitchen-workflow-state.value-object';

@Injectable()
export class KitchenWorkflowStateMachine {
  public transition(workflow: IKitchenWorkflow, newState: KitchenWorkflowStateType): void {
    if (!workflow.state.canTransitionTo(newState)) {
      throw new ConflictException(`Illegal state transition from ${workflow.state.value} to ${newState}`);
    }
    workflow.state = new KitchenWorkflowState(newState);
    workflow.updatedAt = new Date();
  }
}
