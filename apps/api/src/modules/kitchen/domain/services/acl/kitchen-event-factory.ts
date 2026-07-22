import { KitchenIntegrationContext } from '../../value-objects/acl/kitchen-integration-context.value-object';
import {
  KitchenIntegrationStartedEvent,
  KitchenIntegrationCompletedEvent,
  KitchenIntegrationFailedEvent
} from '../../events/acl.events';
import { KitchenIntegrationPolicy } from '../../policies/acl.policy';

export class KitchenEventFactory {
  public static createIntegrationStarted(context: KitchenIntegrationContext, processedIds: Set<string>): KitchenIntegrationStartedEvent {
    KitchenIntegrationPolicy.ensureIdempotency(context, processedIds);
    return new KitchenIntegrationStartedEvent(context);
  }

  public static createIntegrationCompleted(context: KitchenIntegrationContext, resultPayload?: any): KitchenIntegrationCompletedEvent {
    return new KitchenIntegrationCompletedEvent(context, resultPayload);
  }

  public static createIntegrationFailed(context: KitchenIntegrationContext, reason: string, errorDetails?: any): KitchenIntegrationFailedEvent {
    return new KitchenIntegrationFailedEvent(context, reason, errorDetails);
  }
}
