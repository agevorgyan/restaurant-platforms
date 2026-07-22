import { KitchenTicket } from '../aggregates/kitchen-ticket.aggregate';
import { Production } from '../aggregates/production.aggregate';
import { WorkflowSpecification, SchedulingSpecification } from '../specifications/workflow.specification';
import { KitchenTicketStatus as KitchenTicketStatusEnum } from '../enums/kitchen-ticket-status.enum';
import { ProductionStatus as ProductionStatusEnum } from '../enums/production-status.enum';

export class WorkflowPolicy {
  public static validateTicketStart(ticket: KitchenTicket): void {
    if (!WorkflowSpecification.isReadyToStart(ticket)) {
      throw new Error(`Kitchen Ticket ${ticket.id} is not in a valid state to start preparation.`);
    }
  }

  public static validateProductionStart(production: Production): void {
    if (!WorkflowSpecification.isProductionReadyToStart(production)) {
      throw new Error(`Production ${production.id} is not in a valid state to start execution.`);
    }
  }

  public static validateTicketCompletion(ticket: KitchenTicket): void {
    if (ticket.status.value !== KitchenTicketStatusEnum.IN_PREPARATION) {
      throw new Error(`Kitchen Ticket ${ticket.id} cannot be completed from its current state.`);
    }
  }
  
  public static validateProductionCompletion(production: Production): void {
    if (production.status.value !== ProductionStatusEnum.IN_PROGRESS) {
      throw new Error(`Production ${production.id} cannot be completed from its current state.`);
    }
  }
}

export class SchedulingPolicy {
  public static validateScheduling(production: Production): void {
    if (!SchedulingSpecification.canBeScheduled(production)) {
      throw new Error(`Production ${production.id} cannot be scheduled from its current state.`);
    }
  }
}

export class AssignmentPolicy {
  public static ensureValidAssignment(stationId: string, itemId: string): void {
    if (!stationId || !itemId) {
      throw new Error('Station ID and Item ID are required for assignment');
    }
  }
}

export class QueuePolicy {
  public static determineQueuePriority(priorityValue: number, isRush: boolean): number {
    // Lower number means higher priority. Rush orders cut to the front.
    return isRush ? priorityValue - 100 : priorityValue;
  }
}
