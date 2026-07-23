import { MenuIntegrationContext } from '../../value-objects/menu-integration-context.value-object';
import { IntegrationResult } from '../../value-objects/integration-result.value-object';
import { IntegrationCorrelationId } from '../../value-objects/integration-correlation-id.value-object';
import { ReferenceValidationPolicy } from '../../policies/kitchen-inventory.policies';
import { MenuKitchenGateway } from './menu-kitchen.gateway';
import { MenuInventoryGateway } from './menu-inventory.gateway';
import { AvailabilityEvaluationCompletedEvent, ReferenceValidationFailedEvent } from '../../events/kitchen-inventory.events';

export class MenuAvailabilityCoordinator {
  private kitchenGateway = new MenuKitchenGateway();
  private inventoryGateway = new MenuInventoryGateway();

  public evaluate(
    context: MenuIntegrationContext, 
    kitchenFetchFn: (req: any) => any,
    inventoryFetchFn: (req: any) => any
  ): { result: IntegrationResult | null, events: any[] } {
    const correlationId = IntegrationCorrelationId.create().value;
    const events: any[] = [];

    try {
      ReferenceValidationPolicy.validateAll(context);
    } catch (e: any) {
      void e;
      events.push(new ReferenceValidationFailedEvent(correlationId, 'VALIDATION'));
      return { result: null, events };
    }

    const kitchenResponse = this.kitchenGateway.checkAvailability(context, kitchenFetchFn, correlationId);
    events.push(kitchenResponse.event);

    const inventoryResponse = this.inventoryGateway.checkAvailability(context, inventoryFetchFn, correlationId);
    events.push(inventoryResponse.event);

    const isAvailable = kitchenResponse.isAvailable && inventoryResponse.isAvailable;
    
    events.push(new AvailabilityEvaluationCompletedEvent(correlationId, isAvailable ? 'AVAILABLE' : 'UNAVAILABLE'));

    const result = IntegrationResult.create({
      kitchenAvailability: kitchenResponse.isAvailable,
      inventoryAvailability: inventoryResponse.isAvailable,
      availabilityStatus: isAvailable ? 'AVAILABLE' : 'UNAVAILABLE',
      evaluationTimestamp: new Date()
    });

    return { result, events };
  }
}