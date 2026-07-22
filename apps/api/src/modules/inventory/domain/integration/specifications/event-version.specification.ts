import { InventoryIntegrationEventPayload } from '../components/inventory-integration-event';
import { InventoryEventVersion } from '../value-objects/inventory-event-version.value-object';

export class EventVersionSpecification {
  /**
   * Checks if an event meets the minimum required version constraints.
   */
  public static isSatisfiedBy(
    event: InventoryIntegrationEventPayload, 
    minimumVersion: InventoryEventVersion
  ): boolean {
    try {
      const eventVersion = InventoryEventVersion.fromString(event.metadata.version);
      return eventVersion.isCompatibleWith(minimumVersion);
    } catch {
      return false; // If version is malformed, it doesn't satisfy
    }
  }
}
