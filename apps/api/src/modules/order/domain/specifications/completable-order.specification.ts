import { Order } from '../aggregates/order.aggregate';
import { OrderStatusEnum } from '../value-objects/order-status.value-object';

export class CompletableOrderSpecification {
  public isSatisfiedBy(order: Order): boolean {
    // According to matrix, Ready -> Completed or Delivered -> Completed
    return order.status.value === OrderStatusEnum.READY || 
           order.status.value === OrderStatusEnum.DELIVERED;
  }
}
