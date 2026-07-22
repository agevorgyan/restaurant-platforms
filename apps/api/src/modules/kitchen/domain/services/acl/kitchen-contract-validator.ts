import { KitchenEventRegistry } from './kitchen-event-registry';
import { EventRoutingPolicy } from '../../policies/acl.policy';
import { KitchenContractSpecification } from '../../specifications/acl.specification';

export class KitchenContractValidator {
  public static validateInboundPayload(eventName: string, payload: any): void {
    const registryKeys = KitchenEventRegistry.getInboundEventNames();
    EventRoutingPolicy.validateRouting(eventName, registryKeys);

    const registration = KitchenEventRegistry.getRegistration(eventName)!;
    
    if (!KitchenContractSpecification.isValidContractPayload(payload, registration.requiredFields)) {
      throw new Error(`Malformed inbound contract for event ${eventName}. Missing required fields.`);
    }
  }
}
