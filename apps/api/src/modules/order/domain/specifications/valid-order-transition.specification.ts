import { Order } from '../aggregates/order.aggregate';
import { OrderStatusEnum } from '../value-objects/order-status.value-object';

export class ValidOrderTransitionSpecification {
  private static readonly transitionMap: Record<OrderStatusEnum, Set<OrderStatusEnum>> = {
    [OrderStatusEnum.DRAFT]: new Set([OrderStatusEnum.PENDING, OrderStatusEnum.CANCELLED]),
    [OrderStatusEnum.PENDING]: new Set([OrderStatusEnum.CONFIRMED, OrderStatusEnum.REJECTED, OrderStatusEnum.CANCELLED]),
    [OrderStatusEnum.CONFIRMED]: new Set([OrderStatusEnum.PREPARING, OrderStatusEnum.CANCELLED]),
    [OrderStatusEnum.PREPARING]: new Set([OrderStatusEnum.READY, OrderStatusEnum.CANCELLED]),
    [OrderStatusEnum.READY]: new Set([OrderStatusEnum.OUT_FOR_DELIVERY, OrderStatusEnum.COMPLETED, OrderStatusEnum.CANCELLED]),
    [OrderStatusEnum.OUT_FOR_DELIVERY]: new Set([OrderStatusEnum.DELIVERED, OrderStatusEnum.CANCELLED]),
    [OrderStatusEnum.DELIVERED]: new Set([OrderStatusEnum.COMPLETED]),
    [OrderStatusEnum.COMPLETED]: new Set(),
    [OrderStatusEnum.CANCELLED]: new Set(),
    [OrderStatusEnum.REJECTED]: new Set(),
  };

  public isSatisfiedBy(order: Order, nextStatus: OrderStatusEnum): boolean {
    const currentStatus = order.status.value;
    const allowedTransitions = ValidOrderTransitionSpecification.transitionMap[currentStatus];
    
    if (!allowedTransitions) {
      return false;
    }

    return allowedTransitions.has(nextStatus);
  }

  public isTerminal(status: OrderStatusEnum): boolean {
    const allowedTransitions = ValidOrderTransitionSpecification.transitionMap[status];
    return allowedTransitions.size === 0;
  }
}
