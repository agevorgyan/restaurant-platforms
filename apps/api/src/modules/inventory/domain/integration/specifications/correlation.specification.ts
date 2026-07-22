import { InventoryIntegrationEventPayload } from '../components/inventory-integration-event';

export class CorrelationSpecification {
  /**
   * Validates if the integration event has the strictly required correlation identifiers.
   */
  public static isSatisfiedBy(event: InventoryIntegrationEventPayload): boolean {
    if (!event || !event.metadata) {
      return false;
    }

    const { correlationId, eventId } = event.metadata;

    if (!correlationId || correlationId.trim() === '') {
      return false;
    }

    if (!eventId || eventId.trim() === '') {
      return false;
    }

    return true;
  }
}
