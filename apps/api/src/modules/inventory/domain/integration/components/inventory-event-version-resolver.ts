import { InventoryIntegrationEventPayload } from './inventory-integration-event';
import { InventoryEventVersion } from '../value-objects/inventory-event-version.value-object';
import { VersionPolicy } from '../policies/version.policy';

export class InventoryEventVersionResolver {
  constructor(private readonly minimumSupportedVersion: InventoryEventVersion) {}

  public resolveAndValidate(event: InventoryIntegrationEventPayload): InventoryEventVersion {
    VersionPolicy.enforceCompatibility(event, this.minimumSupportedVersion);
    return InventoryEventVersion.fromString(event.metadata.version);
  }
}
