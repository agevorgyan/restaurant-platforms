import { Order } from '../aggregates/order.aggregate';
import { OrderStatusEnum } from '../value-objects/order-status.value-object';

export class CancellableOrderSpecification {
  private static readonly cancellableStates = new Set([
    OrderStatusEnum.DRAFT,
    OrderStatusEnum.PENDING,
    OrderStatusEnum.CONFIRMED,
    OrderStatusEnum.PREPARING,
    OrderStatusEnum.READY,
    OrderStatusEnum.OUT_FOR_DELIVERY
  ]);

  public isSatisfiedBy(order: Order): boolean {
    return CancellableOrderSpecification.cancellableStates.has(order.status.value);
  }
}
