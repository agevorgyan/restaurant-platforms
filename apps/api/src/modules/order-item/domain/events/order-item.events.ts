import { IOrderItem } from '../entities/order-item.interface';

export class OrderItemAddedEvent {
  constructor(public readonly orderItem: IOrderItem) {}
}

export class OrderItemUpdatedEvent {
  constructor(public readonly orderItem: IOrderItem) {}
}

export class OrderItemRemovedEvent {
  constructor(public readonly orderItemId: string, public readonly orderId: string) {}
}
