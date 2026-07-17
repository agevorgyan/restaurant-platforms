import { KitchenStationStatus } from '../value-objects/kitchen-station-status.value-object';
import { KitchenStationCapacity } from '../value-objects/kitchen-station-capacity.value-object';
import { KitchenStationType } from '../value-objects/kitchen-station-type.value-object';

export interface IKitchenStation {
  id: string;
  restaurantId: string;
  branchId: string;
  kitchenId: string;
  name: string;
  stationType: KitchenStationType;
  status: KitchenStationStatus;
  capacity: KitchenStationCapacity;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}
