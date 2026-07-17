export interface KitchenTicketItemDto {
  id: string;
  orderItemId: string;
  productSnapshot: any;
  quantity: number;
  modifierSnapshot: any;
  specialInstructions?: string;
}

export interface CreateKitchenTicketDto {
  restaurantId: string;
  branchId: string;
  kitchenId: string;
  stationId?: string;
  orderId: string;
  ticketNumber: string;
  priority: string;
  estimatedPreparationTime: number;
  notes?: string;
  items: KitchenTicketItemDto[];
}
