import { IKitchenWorkflow } from '../entities/kitchen-workflow.interface';

export interface IKitchenWorkflowRepository {
  findById(id: string): Promise<IKitchenWorkflow | null>;
  save(workflow: IKitchenWorkflow): Promise<void>;
}
