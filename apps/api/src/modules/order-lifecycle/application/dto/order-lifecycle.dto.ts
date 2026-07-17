import { OrderStatusType } from '../../domain/value-objects/order-state.value-object';

export class TransitionOrderDto {
  orderId: string;
  targetState: OrderStatusType;
  reason?: string;
  userId?: string;
}
