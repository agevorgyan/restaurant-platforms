import { KitchenIntegrationContext } from '../value-objects/acl/kitchen-integration-context.value-object';
import { KitchenEventVersion } from '../value-objects/acl/kitchen-event-version.value-object';
import { KitchenIntegrationSpecification, EventVersionSpecification } from '../specifications/acl.specification';

export class KitchenIntegrationPolicy {
  public static ensureIdempotency(context: KitchenIntegrationContext, processedIds: Set<string>): void {
    if (KitchenIntegrationSpecification.isDuplicateIntegration(context, processedIds)) {
      throw new Error(`Integration event with CorrelationId ${context.correlationId.value} has already been processed.`);
    }
  }
}

export class EventRoutingPolicy {
  public static canRouteEvent(eventName: string, registeredEvents: Set<string>): boolean {
    return registeredEvents.has(eventName);
  }

  public static validateRouting(eventName: string, registeredEvents: Set<string>): void {
    if (!this.canRouteEvent(eventName, registeredEvents)) {
      throw new Error(`Event ${eventName} is not supported for routing within the Kitchen BC.`);
    }
  }
}

export class VersionCompatibilityPolicy {
  public static ensureCompatibleVersion(
    version: KitchenEventVersion,
    supportedVersions: KitchenEventVersion[]
  ): void {
    if (!EventVersionSpecification.isSupportedVersion(version, supportedVersions)) {
      throw new Error(`Event schema version ${version.value} is not supported. Required major version must match and minor version must be backward compatible.`);
    }
  }
}
