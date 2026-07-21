import { AutomationWorkflow } from '../aggregates/automation-workflow.aggregate';

export interface AutomationWorkflowRepository {
  findById(id: string): Promise<AutomationWorkflow | null>;
  save(workflow: AutomationWorkflow): Promise<void>;
  delete(id: string): Promise<void>;
}
