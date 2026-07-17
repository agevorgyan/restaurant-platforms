import { OrderItemSnapshot } from '../value-objects/order-item-snapshot.value-object';
import { OrderItemModifier } from '../value-objects/order-item-modifier.value-object';

import { OrderItemStatus } from '../value-objects/order-item-status.value-object';

export interface IOrderItem {
  id: string;
  orderId: string;
  productId: string;
  productSnapshot: OrderItemSnapshot;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  modifierSelections: OrderItemModifier[];
  specialInstructions?: string;
  status: OrderItemStatus;
  createdAt: Date;
  updatedAt: Date;
}
