import { ContractMetadata } from './inbound.contracts';

export interface DisplayedPriceRequestedContract {
  priceId: string;
  metadata: ContractMetadata;
}

export interface AvailabilityEvaluationRequestedContract {
  menuId: string;
  metadata: ContractMetadata;
}

export interface KitchenAvailabilityRequestedContract {
  stationId: string;
  metadata: ContractMetadata;
}

export interface InventoryAvailabilityRequestedContract {
  itemId: string;
  metadata: ContractMetadata;
}

export interface MenuPublishedContract {
  menuId: string;
  metadata: ContractMetadata;
}

export interface MenuArchivedContract {
  menuId: string;
  metadata: ContractMetadata;
}

export interface MenuItemPublishedContract {
  itemId: string;
  metadata: ContractMetadata;
}

export interface ModifierGroupPublishedContract {
  groupId: string;
  metadata: ContractMetadata;
}