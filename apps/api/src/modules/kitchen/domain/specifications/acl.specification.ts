import { KitchenIntegrationContext } from '../value-objects/acl/kitchen-integration-context.value-object';
import { KitchenEventVersion } from '../value-objects/acl/kitchen-event-version.value-object';

export class KitchenIntegrationSpecification {
  public static isDuplicateIntegration(
    context: KitchenIntegrationContext,
    processedCorrelationIds: Set<string>
  ): boolean {
    return processedCorrelationIds.has(context.correlationId.value);
  }
}

export class EventVersionSpecification {
  public static isSupportedVersion(
    version: KitchenEventVersion,
    supportedVersions: KitchenEventVersion[]
  ): boolean {
    return supportedVersions.some(v => v.major === version.major && v.minor >= version.minor);
  }
}

export class KitchenContractSpecification {
  public static isValidContractPayload(payload: any, requiredFields: string[]): boolean {
    if (!payload || typeof payload !== 'object') return false;
    for (const field of requiredFields) {
      if (!(field in payload)) return false;
    }
    return true;
  }
}
