import { KitchenTicketPriority } from '../value-objects/kitchen-ticket-priority.value-object';
import { KitchenTicketStatus } from '../value-objects/kitchen-ticket-status.value-object';
import { PreparationTime } from '../value-objects/preparation-time.value-object';
import { IKitchenTicketItem } from './kitchen-ticket-item.interface';

export interface IKitchenTicket {
  id: string;
  restaurantId: string;
  branchId: string;
  kitchenId: string;
  stationId?: string;
  orderId: string;
  ticketNumber: string;
  priority: KitchenTicketPriority;
  status: KitchenTicketStatus;
  estimatedPreparationTime: PreparationTime;
  requestedAt: Date;
  startedAt?: Date;
  readyAt?: Date;
  completedAt?: Date;
  notes?: string;
  items: IKitchenTicketItem[];
  createdAt: Date;
  updatedAt: Date;
}
