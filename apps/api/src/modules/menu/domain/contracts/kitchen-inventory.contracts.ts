// Inbound
export interface KitchenStatusUpdatedContract {
  kitchenStationId: string;
  status: string;
}

export interface RecipeAvailabilityChangedContract {
  recipeId: string;
  isAvailable: boolean;
}

export interface KitchenStationUpdatedContract {
  kitchenStationId: string;
  isActive: boolean;
}

export interface InventoryAvailabilityUpdatedContract {
  inventoryItemId: string;
  branchId: string;
  isAvailable: boolean;
}

export interface InventoryItemArchivedContract {
  inventoryItemId: string;
}

// Outbound
export interface KitchenAvailabilityRequestedContract {
  correlationId: string;
  kitchenStationId: string;
  branchId: string;
}

export interface InventoryAvailabilityRequestedContract {
  correlationId: string;
  inventoryItemId: string;
  branchId: string;
}

export interface RecipeValidationRequestedContract {
  correlationId: string;
  recipeId: string;
}

export interface AvailabilityEvaluationRequestedContract {
  correlationId: string;
  branchId: string;
}