import { QueueCapacity } from '../value-objects/queue-capacity.value-object';
import { QueueStrategyType } from '../strategies/queue-strategy.interface';
import { QueuePriority } from '../value-objects/queue-priority.value-object';
import { QueuePosition } from '../value-objects/queue-position.value-object';

export interface IQueuedTicket {
  ticketId: string;
  position: QueuePosition;
  priority: QueuePriority;
  enteredAt: Date;
}

export interface IKitchenQueue {
  id: string;
  restaurantId: string;
  branchId: string;
  kitchenId: string;
  stationId: string;
  strategy: QueueStrategyType;
  capacity: QueueCapacity;
  tickets: IQueuedTicket[];
  createdAt: Date;
  updatedAt: Date;
}
