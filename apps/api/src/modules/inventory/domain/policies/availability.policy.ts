import { Inventory } from '../aggregates/inventory.aggregate';
import { InventoryLedger } from '../aggregates/inventory-ledger.aggregate';
import { InventoryAvailabilitySpecification } from '../specifications/inventory-availability.specification';

export class AvailabilityPolicy {
  public static validateAvailabilityCalculation(inventory: Inventory, ledger?: InventoryLedger): void {
    InventoryAvailabilitySpecification.isSatisfiedBy(inventory, ledger);
  }
}
