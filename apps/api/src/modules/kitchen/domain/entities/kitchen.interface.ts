import { KitchenStatus } from '../value-objects/kitchen-status.value-object';
import { KitchenPriorityMode } from '../value-objects/kitchen-priority.value-object';

export interface IKitchen {
  id: string;
  restaurantId: string;
  branchId: string;
  name: string;
  status: KitchenStatus;
  priorityMode: KitchenPriorityMode;
  timezone: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}
