import { MenuIntegrationContext } from '../../value-objects/menu-integration-context.value-object';
import { KitchenReferenceSpecification, RecipeReferenceSpecification } from '../../specifications/kitchen-inventory.specifications';

export class KitchenReferenceResolver {
  public static resolve(context: MenuIntegrationContext, fetchFn: (req: any) => any): boolean {
    if (!KitchenReferenceSpecification.isSatisfiedBy(context)) {
      return true; // Unconstrained by kitchen
    }
    
    return fetchFn({ 
      kitchenStationId: context.kitchenStationRef?.stationId,
      recipeId: RecipeReferenceSpecification.isSatisfiedBy(context) ? context.recipeRef?.recipeId : undefined,
      branchId: context.branchReference 
    }).isAvailable;
  }
}