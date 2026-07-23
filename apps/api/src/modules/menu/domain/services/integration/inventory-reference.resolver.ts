import { MenuIntegrationContext } from '../../value-objects/menu-integration-context.value-object';
import { InventoryReferenceSpecification } from '../../specifications/kitchen-inventory.specifications';

export class InventoryReferenceResolver {
  public static resolve(context: MenuIntegrationContext, fetchFn: (req: any) => any): boolean {
    if (!InventoryReferenceSpecification.isSatisfiedBy(context)) {
      return true; // Unconstrained by inventory
    }
    
    return fetchFn({
      inventoryItemId: context.inventoryItemRef?.inventoryItemId,
      branchId: context.branchReference
    }).isAvailable;
  }
}