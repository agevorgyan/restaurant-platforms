import { KitchenTicketStatus as KitchenTicketStatusEnum } from '../enums/kitchen-ticket-status.enum';
import { ProductionPriority } from '../enums/production-priority.enum';
import { KitchenTicketItem } from '../entities/kitchen-ticket-item.entity';
import { KitchenTicketConsistencySpecification } from '../specifications/kitchen-ticket.specification';

export class KitchenWorkflowPolicy {
  public static canStartPreparation(status: KitchenTicketStatusEnum): boolean {
    return status === KitchenTicketStatusEnum.QUEUED;
  }

  public static canMarkReady(status: KitchenTicketStatusEnum): boolean {
    return status === KitchenTicketStatusEnum.IN_PREPARATION;
  }
}

export class KitchenPriorityPolicy {
  public static canChangePriority(status: KitchenTicketStatusEnum): boolean {
    // Priority can only be changed before the ticket is ready or terminal
    return [
      KitchenTicketStatusEnum.PENDING,
      KitchenTicketStatusEnum.QUEUED,
      KitchenTicketStatusEnum.IN_PREPARATION
    ].includes(status);
  }

  public static isValidTransition(current: ProductionPriority, next: ProductionPriority): boolean {
    return current !== next;
  }
}

export class KitchenAssignmentPolicy {
  public static canAssignStation(status: KitchenTicketStatusEnum): boolean {
    return [
      KitchenTicketStatusEnum.PENDING,
      KitchenTicketStatusEnum.QUEUED,
      KitchenTicketStatusEnum.IN_PREPARATION
    ].includes(status);
  }
}

export class KitchenTicketValidationPolicy {
  public static validate(items: KitchenTicketItem[]): void {
    if (!KitchenTicketConsistencySpecification.isSatisfiedBy(items)) {
      throw new Error('Kitchen Ticket must have at least one valid item with no duplicate order items');
    }
  }
}
