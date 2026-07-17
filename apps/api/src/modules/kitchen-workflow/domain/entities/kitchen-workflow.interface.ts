import { KitchenWorkflowState } from '../value-objects/kitchen-workflow-state.value-object';
import { PreparationTimePolicy } from '../value-objects/preparation-time-policy.value-object';

export interface IKitchenWorkflow {
  id: string;
  ticketId: string;
  kitchenId: string;
  state: KitchenWorkflowState;
  timePolicy: PreparationTimePolicy;
  startedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
