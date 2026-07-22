import { KitchenTicket } from '../aggregates/kitchen-ticket.aggregate';
import { Production } from '../aggregates/production.aggregate';
import { KitchenTicketStatus as KitchenTicketStatusEnum } from '../enums/kitchen-ticket-status.enum';
import { ProductionStatus as ProductionStatusEnum } from '../enums/production-status.enum';

export class WorkflowSpecification {
  public static isReadyToStart(ticket: KitchenTicket): boolean {
    return ticket.status.value === KitchenTicketStatusEnum.QUEUED;
  }

  public static isProductionReadyToStart(production: Production): boolean {
    return production.status.value === ProductionStatusEnum.SCHEDULED;
  }
}

export class StationAvailabilitySpecification {
  public static isStationAvailable(stationId: string, currentQueueDepth: number, maxCapacity: number): boolean {
    return currentQueueDepth < maxCapacity;
  }
}

export class QueueConsistencySpecification {
  public static isValidSnapshot(depth: number): boolean {
    return depth >= 0;
  }
}

export class SchedulingSpecification {
  public static canBeScheduled(production: Production): boolean {
    return production.status.value === ProductionStatusEnum.PLANNED;
  }
}
