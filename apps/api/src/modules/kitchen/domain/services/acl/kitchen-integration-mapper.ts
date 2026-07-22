import { KitchenIntegrationContext } from '../../value-objects/acl/kitchen-integration-context.value-object';
import { KitchenCorrelationId } from '../../value-objects/acl/kitchen-correlation-id.value-object';
import { KitchenCausationId } from '../../value-objects/acl/kitchen-causation-id.value-object';
import { KitchenEventVersionResolver } from './kitchen-event-version-resolver';
import { KitchenContractValidator } from './kitchen-contract-validator';
import { KitchenEventPriority } from '../../value-objects/acl/kitchen-event-priority.value-object';

export class KitchenIntegrationMapper {
  public static mapInboundEventToContext(
    eventName: string,
    payload: any,
    correlationIdStr: string,
    versionStr: string,
    priority: KitchenEventPriority = KitchenEventPriority.default(),
    causationIdStr?: string
  ): KitchenIntegrationContext {
    KitchenContractValidator.validateInboundPayload(eventName, payload);
    const version = KitchenEventVersionResolver.resolveInboundVersion(eventName, versionStr);
    
    const correlationId = KitchenCorrelationId.create(correlationIdStr);
    const causationId = causationIdStr ? KitchenCausationId.create(causationIdStr) : undefined;

    return KitchenIntegrationContext.create(correlationId, version, eventName, payload, priority, causationId);
  }
}
