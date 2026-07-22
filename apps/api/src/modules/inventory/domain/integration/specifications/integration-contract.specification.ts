import { InventoryIntegrationEventPayload } from '../components/inventory-integration-event';

export class IntegrationContractSpecification {
  /**
   * Validates if a raw payload strictly conforms to the IntegrationContract schema.
   */
  public static isSatisfiedBy(payload: any): payload is InventoryIntegrationEventPayload {
    if (!payload) return false;
    if (!payload.metadata) return false;
    
    const { metadata } = payload;
    
    if (typeof metadata.eventId !== 'string') return false;
    if (typeof metadata.correlationId !== 'string') return false;
    if (typeof metadata.timestamp !== 'string') return false;
    if (typeof metadata.version !== 'string') return false;
    if (typeof metadata.priority !== 'string') return false;
    if (typeof metadata.source !== 'string') return false;
    if (typeof metadata.eventName !== 'string') return false;
    
    if (payload.data === undefined) return false;

    return true;
  }
}
