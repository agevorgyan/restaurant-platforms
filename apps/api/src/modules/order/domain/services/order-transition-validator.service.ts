import { Order } from '../aggregates/order.aggregate';
import { OrderStatusEnum } from '../value-objects/order-status.value-object';
import { OrderTransitionPolicy } from '../policies/order-transition.policy';
import { OrderCancellationPolicy } from '../policies/order-cancellation.policy';
import { OrderCompletionPolicy } from '../policies/order-completion.policy';

export type ValidationResult = { isSuccess: true } | { isFailure: true; error: string };

export class OrderTransitionValidator {
  private readonly transitionPolicy = new OrderTransitionPolicy();
  private readonly cancellationPolicy = new OrderCancellationPolicy();
  private readonly completionPolicy = new OrderCompletionPolicy();

  public validateTransition(order: Order, nextStatus: OrderStatusEnum): ValidationResult {
    if (nextStatus === OrderStatusEnum.CANCELLED && !this.cancellationPolicy.isSatisfiedBy(order)) {
      return { isFailure: true, error: `Order in state ${order.status.value} cannot be cancelled` };
    }

    if (nextStatus === OrderStatusEnum.COMPLETED && !this.completionPolicy.isSatisfiedBy(order)) {
      return { isFailure: true, error: `Order in state ${order.status.value} cannot be completed directly` };
    }

    if (!this.transitionPolicy.canTransition(order, nextStatus)) {
      return { isFailure: true, error: `Illegal state transition from ${order.status.value} to ${nextStatus}` };
    }

    return { isSuccess: true };
  }
}
