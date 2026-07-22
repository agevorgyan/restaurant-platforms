import { Inventory } from '../aggregates/inventory.aggregate';
import { InventoryConsistencySpecification } from '../specifications/inventory-consistency.specification';
import { InventoryStateEnum } from '../value-objects/inventory-state.value-object';

export class InventoryValidationPolicy {
  public static validate(inventory: Inventory): void {
    // Verify aggregate-level invariants
    InventoryConsistencySpecification.isSatisfiedBy(inventory);

    // Additional state-specific validations could go here
    if (inventory.state.value === InventoryStateEnum.ACTIVE) {
      if (!inventory.location) {
        throw new Error('Active inventory must have a location');
      }
    }
  }
}
