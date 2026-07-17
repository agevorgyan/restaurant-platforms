export interface IKitchenWorkflowPolicy {
  canStartPreparation(workflowId: string): Promise<boolean>;
  canCompleteWorkflow(workflowId: string): Promise<boolean>;
}
