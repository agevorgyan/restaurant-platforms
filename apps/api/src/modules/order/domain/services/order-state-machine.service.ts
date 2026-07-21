import { Order } from '../aggregates/order.aggregate';
import { OrderStatus, OrderStatusEnum } from '../value-objects/order-status.value-object';
import { OrderTransitionValidator, ValidationResult } from './order-transition-validator.service';

export class OrderStateMachine {
  private readonly validator: OrderTransitionValidator;

  constructor() {
    this.validator = new OrderTransitionValidator();
  }

  /**
   * Evaluates if a transition is possible.
   */
  public evaluateTransition(order: Order, nextStatus: OrderStatusEnum): ValidationResult {
    return this.validator.validateTransition(order, nextStatus);
  }

  /**
   * Applies the transition strictly in memory (does not dispatch domain events).
   */
  public applyTransition(order: Order, nextStatus: OrderStatusEnum): ValidationResult {
    const evaluation = this.evaluateTransition(order, nextStatus);
    if ('isFailure' in evaluation) {
      return evaluation;
    }

    // Idempotent check
    if (order.status.value === nextStatus) {
      return { isSuccess: true };
    }

    order.changeStatus(OrderStatus.create(nextStatus));
    return { isSuccess: true };
  }
}
