import { MenuIntegrationContext } from '../value-objects/menu-integration-context.value-object';

export class KitchenReferenceSpecification {
  public static isSatisfiedBy(context: MenuIntegrationContext): boolean {
    return !!context.kitchenStationRef;
  }
}

export class InventoryReferenceSpecification {
  public static isSatisfiedBy(context: MenuIntegrationContext): boolean {
    return !!context.inventoryItemRef;
  }
}

export class AvailabilityIntegrationSpecification {
  public static isSatisfiedBy(context: MenuIntegrationContext): boolean {
    return !!context.branchReference && !!context.salesChannel;
  }
}

export class RecipeReferenceSpecification {
  public static isSatisfiedBy(context: MenuIntegrationContext): boolean {
    return !!context.recipeRef;
  }
}

export class IntegrationConsistencySpecification {
  public static isSatisfiedBy(context: MenuIntegrationContext): boolean {
    return !!context.evaluationDateTime;
  }
}