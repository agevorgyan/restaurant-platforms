import { IOrder } from '../entities/order.interface';

export class OrderCreatedEvent {
  constructor(public readonly order: IOrder) {}
}

export class OrderCancelledEvent {
  constructor(
    public readonly orderId: string,
    public readonly restaurantId: string
  ) {}
}
