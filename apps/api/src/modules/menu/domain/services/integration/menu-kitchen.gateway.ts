import { MenuIntegrationContext } from '../../value-objects/menu-integration-context.value-object';
import { KitchenReferenceResolver } from './kitchen-reference.resolver';
import { KitchenAvailabilityResolvedEvent, AvailabilityIntegrationFailedEvent } from '../../events/kitchen-inventory.events';

export class MenuKitchenGateway {
  public checkAvailability(context: MenuIntegrationContext, fetchFn: (req: any) => any, correlationId: string): { isAvailable: boolean, event: any } {
    try {
      const isAvailable = KitchenReferenceResolver.resolve(context, fetchFn);
      return { isAvailable, event: new KitchenAvailabilityResolvedEvent(correlationId, isAvailable) };
    } catch (e: any) {
      return { isAvailable: false, event: new AvailabilityIntegrationFailedEvent(correlationId, e.message) };
    }
  }
}