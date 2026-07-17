export class CreateOrderDto {
  restaurantId: string;
  branchId: string;
  orderNumber: string;
  orderType: string;
  customerId?: string;
  tableId?: string;
  cartId?: string;
  notes?: string;
}

export class UpdateOrderDto {
  orderType?: string;
  status?: string;
  customerId?: string;
  tableId?: string;
  notes?: string;
}
