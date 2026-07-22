import { InventoryIntegrationEventPayload } from '../components/inventory-integration-event';
import { InventoryEventVersion } from '../value-objects/inventory-event-version.value-object';
import { EventVersionSpecification } from '../specifications/event-version.specification';

export class VersionPolicy {
  /**
   * Enforces version compatibility using EventVersionSpecification.
   * Throws explicit errors to be caught and mapped to Failed events.
   */
  public static enforceCompatibility(
    event: InventoryIntegrationEventPayload,
    minimumVersion: InventoryEventVersion
  ): void {
    if (!EventVersionSpecification.isSatisfiedBy(event, minimumVersion)) {
      throw new Error(`Integration Event rejected: Version ${event.metadata.version} is incompatible or below minimum supported version ${minimumVersion.versionString}`);
    }
  }
}
