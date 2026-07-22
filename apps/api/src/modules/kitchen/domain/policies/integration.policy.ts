import { Production } from '../aggregates/production.aggregate';
import { KitchenTicket } from '../aggregates/kitchen-ticket.aggregate';
import { KitchenInventoryIntegrationSpecification } from '../specifications/integration.specification';
import { ProductionStatus as ProductionStatusEnum } from '../enums/production-status.enum';

export class KitchenInventoryIntegrationPolicy {
  public static ensureUniqueRequest(correlationId: string, existingIds: string[]): void {
    if (KitchenInventoryIntegrationSpecification.isDuplicateRequest(correlationId, existingIds)) {
      throw new Error(`Duplicate inventory integration request detected for correlationId: ${correlationId}`);
    }
  }
}

export class ConsumptionPolicy {
  public static canRequestConsumption(production: Production): boolean {
    // We only consume ingredients once the production is completed
    return production.status.value === ProductionStatusEnum.COMPLETED;
  }

  public static validateConsumption(production: Production): void {
    if (!this.canRequestConsumption(production)) {
      throw new Error(`Cannot request consumption for Production ${production.id} in state ${production.status.value}. Must be COMPLETED.`);
    }
  }
}

export class ReservationSynchronizationPolicy {
  public static canReleaseReservation(ticket: KitchenTicket): boolean {
    return ticket.status.isCancelled();
  }

  public static validateRelease(ticket: KitchenTicket): void {
    if (!this.canReleaseReservation(ticket)) {
      throw new Error(`Cannot release reservation for Kitchen Ticket ${ticket.id} unless it is cancelled.`);
    }
  }
}
