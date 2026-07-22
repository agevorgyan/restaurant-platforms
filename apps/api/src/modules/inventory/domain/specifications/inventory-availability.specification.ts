import { Inventory } from '../aggregates/inventory.aggregate';
import { InventoryLedger } from '../aggregates/inventory-ledger.aggregate';

export class InventoryAvailabilitySpecification {
  public static isSatisfiedBy(inventory: Inventory, ledger?: InventoryLedger): boolean {
    if (inventory.state.value !== 'ACTIVE') {
      throw new Error('Inventory must be active to calculate availability');
    }

    if (ledger && ledger.inventoryId !== inventory.id) {
      throw new Error('Ledger inventory ID must match Inventory ID');
    }

    return true;
  }
}
