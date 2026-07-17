export interface CreateKitchenQueueDto {
  restaurantId: string;
  branchId: string;
  kitchenId: string;
  stationId: string;
  strategy: string;
  capacity: number;
}

export interface EnqueueTicketDto {
  ticketId: string;
  priority: string;
}

export interface ReorderTicketDto {
  ticketId: string;
  newPosition: number;
}
