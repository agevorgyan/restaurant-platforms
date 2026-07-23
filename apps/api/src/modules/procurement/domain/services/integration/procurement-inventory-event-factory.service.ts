import { InventoryIncreaseRequestedEvent, InventoryBatchRegistrationRequestedEvent } from '../../events/integration.events';

export class ProcurementInventoryEventFactory {
  public createInventoryIncreaseRequest(payload: any, correlationId: string, causationId: string): InventoryIncreaseRequestedEvent {
    return new InventoryIncreaseRequestedEvent(crypto.randomUUID(), correlationId, causationId, payload);
  }

  public createBatchRegistrationRequest(payload: any, correlationId: string, causationId: string): InventoryBatchRegistrationRequestedEvent {
    return new InventoryBatchRegistrationRequestedEvent(crypto.randomUUID(), correlationId, causationId, payload);
  }
}