import { MenuIntegrationContext } from '../../value-objects/menu-integration-context.value-object';
import { InventoryReferenceResolver } from './inventory-reference.resolver';
import { InventoryAvailabilityResolvedEvent, AvailabilityIntegrationFailedEvent } from '../../events/kitchen-inventory.events';

export class MenuInventoryGateway {
  public checkAvailability(context: MenuIntegrationContext, fetchFn: (req: any) => any, correlationId: string): { isAvailable: boolean, event: any } {
    try {
      const isAvailable = InventoryReferenceResolver.resolve(context, fetchFn);
      return { isAvailable, event: new InventoryAvailabilityResolvedEvent(correlationId, isAvailable) };
    } catch (e: any) {
      return { isAvailable: false, event: new AvailabilityIntegrationFailedEvent(correlationId, e.message) };
    }
  }
}