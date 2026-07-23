import { MenuAvailabilityCoordinator } from '../services/integration/menu-availability.coordinator';
import { MenuIntegrationContext } from '../value-objects/menu-integration-context.value-object';
import { KitchenStationReference } from '../value-objects/kitchen-station-reference.value-object';
import { InventoryItemReference } from '../value-objects/inventory-item-reference.value-object';

describe('MenuAvailabilityCoordinator', () => {
  it('should successfully coordinate kitchen and inventory availability', () => {
    const coordinator = new MenuAvailabilityCoordinator();
    
    const context = MenuIntegrationContext.create({
      branchReference: 'branch-1',
      salesChannel: 'POS',
      kitchenStationRef: KitchenStationReference.create('station-1'),
      inventoryItemRef: InventoryItemReference.create('inv-1'),
      evaluationDateTime: new Date()
    });

    const mockKitchenFetch = () => ({ isAvailable: true });
    const mockInventoryFetch = () => ({ isAvailable: true });

    const { result, events } = coordinator.evaluate(context, mockKitchenFetch, mockInventoryFetch);

    expect(result).toBeDefined();
    expect(result?.availabilityStatus).toBe('AVAILABLE');
    expect(result?.kitchenAvailability).toBe(true);
    expect(result?.inventoryAvailability).toBe(true);
    expect(events.length).toBe(3);
    expect(events[2].constructor.name).toBe('AvailabilityEvaluationCompletedEvent');
  });

  it('should handle validation failures gracefully', () => {
    const coordinator = new MenuAvailabilityCoordinator();
    
    const context = MenuIntegrationContext.create({
      branchReference: 'branch-1',
      salesChannel: 'POS',
      // Fails validation policy: Recipe without KitchenStation
      recipeRef: { recipeId: 'recipe-1' } as any,
      evaluationDateTime: new Date()
    });

    const { result, events } = coordinator.evaluate(context, () => ({}), () => ({}));

    expect(result).toBeNull();
    expect(events.length).toBe(1);
    expect(events[0].constructor.name).toBe('ReferenceValidationFailedEvent');
  });
});