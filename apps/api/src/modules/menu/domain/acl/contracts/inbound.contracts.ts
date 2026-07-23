export interface PricingUpdatedContract {
  priceId: string;
  newAmount: number;
  currency: string;
  metadata: ContractMetadata;
}

export interface PriceArchivedContract {
  priceId: string;
  metadata: ContractMetadata;
}

export interface CurrencyUpdatedContract {
  code: string;
  rate: number;
  metadata: ContractMetadata;
}

export interface InventoryAvailabilityUpdatedContract {
  itemId: string;
  available: boolean;
  metadata: ContractMetadata;
}

export interface InventoryItemArchivedContract {
  itemId: string;
  metadata: ContractMetadata;
}

export interface KitchenAvailabilityUpdatedContract {
  stationId: string;
  available: boolean;
  metadata: ContractMetadata;
}

export interface RecipeArchivedContract {
  recipeId: string;
  metadata: ContractMetadata;
}

export interface ModifierGroupUpdatedContract {
  groupId: string;
  status: string;
  metadata: ContractMetadata;
}

export interface ContractMetadata {
  correlationId: string;
  causationId: string;
  eventVersion: string;
  schemaVersion: string;
  producer: string;
  timestamp: string;
}