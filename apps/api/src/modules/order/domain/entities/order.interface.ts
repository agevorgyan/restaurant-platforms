import { OrderNumber } from '../value-objects/order-number.value-object';
import { OrderType } from '../value-objects/order-type.value-object';
import { OrderStatus } from '../value-objects/order-status.value-object';

export interface IOrder {
  id: string;
  restaurantId: string;
  branchId: string;
  orderNumber: OrderNumber;
  customerId?: string;
  tableId?: string;
  cartId?: string;
  orderType: OrderType;
  status: OrderStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
