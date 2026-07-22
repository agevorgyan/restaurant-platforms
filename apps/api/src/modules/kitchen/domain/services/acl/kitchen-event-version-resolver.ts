import { KitchenEventVersion } from '../../value-objects/acl/kitchen-event-version.value-object';
import { KitchenEventRegistry } from './kitchen-event-registry';
import { VersionCompatibilityPolicy } from '../../policies/acl.policy';

export class KitchenEventVersionResolver {
  public static resolveInboundVersion(eventName: string, payloadVersionStr: string): KitchenEventVersion {
    const version = KitchenEventVersion.fromString(payloadVersionStr);
    const registration = KitchenEventRegistry.getRegistration(eventName);
    
    if (!registration) {
      throw new Error(`Cannot resolve version for unknown event: ${eventName}`);
    }

    VersionCompatibilityPolicy.ensureCompatibleVersion(version, registration.supportedVersions);
    
    return version; // Can map payload adaptation here in the future if required
  }
}
