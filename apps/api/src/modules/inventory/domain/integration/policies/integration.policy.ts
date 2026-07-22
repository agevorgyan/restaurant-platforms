import { InventoryIntegrationEventPayload } from '../components/inventory-integration-event';

export class IntegrationPolicy {
  /**
   * Evaluates if the event should be processed.
   * Allows rejection based on idempotency (e.g. tracking already processed correlation/event IDs)
   */
  public static canProcess(
    event: InventoryIntegrationEventPayload,
    processedEventIds: string[]
  ): { isAllowed: boolean; reason?: string } {
    if (processedEventIds.includes(event.metadata.eventId)) {
      return { isAllowed: false, reason: `Event ${event.metadata.eventId} already processed (Idempotency check failed)` };
    }

    return { isAllowed: true };
  }
}
