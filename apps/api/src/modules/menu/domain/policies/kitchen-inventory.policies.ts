import { MenuIntegrationContext } from '../value-objects/menu-integration-context.value-object';

export class KitchenIntegrationPolicy {
  public static validate(context: MenuIntegrationContext): void {
    if (!context.kitchenStationRef && context.recipeRef) {
      throw new Error('Recipe reference cannot exist without a Kitchen Station reference');
    }
  }
}

export class InventoryIntegrationPolicy {
  public static validate(context: MenuIntegrationContext): void {
    if (context.inventoryItemRef && !context.branchReference) {
      throw new Error('Branch reference is required to resolve inventory');
    }
  }
}

export class AvailabilityIntegrationPolicy {
  public static allowIntegration(context: MenuIntegrationContext): boolean {
    return !!context.branchReference;
  }
}

export class ReferenceValidationPolicy {
  public static validateAll(context: MenuIntegrationContext): void {
    KitchenIntegrationPolicy.validate(context);
    InventoryIntegrationPolicy.validate(context);
  }
}

export class IntegrationFailurePolicy {
  public static handleFailure(reason: string): void {
    void reason;
    // Record integration failure
  }
}