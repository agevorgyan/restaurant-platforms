import { Production } from '../../aggregates/production.aggregate';
import { KitchenTicket } from '../../aggregates/kitchen-ticket.aggregate';
import { ConsumptionPolicy, ReservationSynchronizationPolicy } from '../../policies/integration.policy';
import { KitchenInventoryMapper } from './kitchen-inventory-mapper';
import { KitchenInventoryContractValidator } from './kitchen-inventory-contract-validator';
import {
  KitchenInventoryConsumptionRequestedEvent,
  KitchenInventoryReservationRequestedEvent,
  KitchenInventoryReleaseRequestedEvent
} from '../../events/integration.events';
import { InventoryRequestReference } from '../../value-objects/integration/inventory-request-reference.value-object';

export class KitchenInventoryEventFactory {
  public static createConsumptionEvent(production: Production, correlationId: string): KitchenInventoryConsumptionRequestedEvent {
    ConsumptionPolicy.validateConsumption(production);
    
    const request = KitchenInventoryMapper.mapProductionToConsumptionRequest(production, correlationId);
    KitchenInventoryContractValidator.validateOutboundConsumption(request);
    
    return new KitchenInventoryConsumptionRequestedEvent(request);
  }

  public static createReservationEvent(production: Production, correlationId: string): KitchenInventoryReservationRequestedEvent {
    // A production block usually reserves ingredients when planned or scheduled
    const request = KitchenInventoryMapper.mapProductionToReservationRequest(production, correlationId);
    KitchenInventoryContractValidator.validateOutboundReservation(request);
    
    return new KitchenInventoryReservationRequestedEvent(request);
  }

  public static createReleaseEvent(ticket: KitchenTicket, correlationId: string, reason: string): KitchenInventoryReleaseRequestedEvent {
    ReservationSynchronizationPolicy.validateRelease(ticket);
    
    const reference = InventoryRequestReference.create(correlationId, 'KITCHEN_TICKET_CANCEL');
    return new KitchenInventoryReleaseRequestedEvent(reference, reason);
  }
}
