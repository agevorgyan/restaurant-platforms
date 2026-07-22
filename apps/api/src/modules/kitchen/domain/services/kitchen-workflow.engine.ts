import { KitchenTicket } from '../aggregates/kitchen-ticket.aggregate';
import { Production } from '../aggregates/production.aggregate';
import { WorkflowRequest } from '../value-objects/workflow-request.value-object';
import { WorkflowResult } from '../value-objects/workflow-result.value-object';
import { WorkflowPolicy } from '../policies/workflow.policy';

export class KitchenWorkflowEngine {
  public startTicketPreparation(ticket: KitchenTicket, request: WorkflowRequest): WorkflowResult {
    try {
      WorkflowPolicy.validateTicketStart(ticket);
      ticket.startPreparation(request.triggeredBy);
      return WorkflowResult.success(`Preparation started for Kitchen Ticket ${ticket.id}`);
    } catch (error: any) {
      return WorkflowResult.failure(error.message, [error.message]);
    }
  }

  public completeTicketPreparation(ticket: KitchenTicket, request: WorkflowRequest): WorkflowResult {
    try {
      WorkflowPolicy.validateTicketCompletion(ticket);
      ticket.markReady(request.triggeredBy);
      return WorkflowResult.success(`Preparation complete for Kitchen Ticket ${ticket.id}`);
    } catch (error: any) {
      return WorkflowResult.failure(error.message, [error.message]);
    }
  }

  public startProductionExecution(production: Production, request: WorkflowRequest): WorkflowResult {
    try {
      WorkflowPolicy.validateProductionStart(production);
      production.startExecution(request.triggeredBy);
      return WorkflowResult.success(`Execution started for Production ${production.id}`);
    } catch (error: any) {
      return WorkflowResult.failure(error.message, [error.message]);
    }
  }

  public completeProductionExecution(production: Production, request: WorkflowRequest): WorkflowResult {
    try {
      WorkflowPolicy.validateProductionCompletion(production);
      production.completeExecution(request.triggeredBy);
      return WorkflowResult.success(`Execution complete for Production ${production.id}`);
    } catch (error: any) {
      return WorkflowResult.failure(error.message, [error.message]);
    }
  }

  public pauseProductionExecution(production: Production, request: WorkflowRequest, reason: string): WorkflowResult {
    try {
      production.pauseExecution(request.triggeredBy, reason);
      return WorkflowResult.success(`Execution paused for Production ${production.id}`);
    } catch (error: any) {
      return WorkflowResult.failure(error.message, [error.message]);
    }
  }
}
