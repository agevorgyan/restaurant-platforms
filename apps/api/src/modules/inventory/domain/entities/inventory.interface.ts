import { InventoryStatus } from '../value-objects/inventory-status.value-object';
import { InventoryType } from '../value-objects/inventory-type.value-object';
import { InventoryLocation } from '../value-objects/inventory-location.value-object';
import { InventoryCapacity } from '../value-objects/inventory-capacity.value-object';

export interface IInventory {
  id: string;
  restaurantId: string;
  branchId?: string;
  name: string;
  code: string;
  type: InventoryType;
  status: InventoryStatus;
  location: InventoryLocation;
  capacity: InventoryCapacity;
  createdAt: Date;
  updatedAt: Date;
}
