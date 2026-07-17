import { Injectable } from '@nestjs/common';
import { OrderState, OrderStatusType } from '../value-objects/order-state.value-object';
import { IOrderTransitionPolicy } from '../interfaces/order-transition-policy.interface';

@Injectable()
export class OrderStateMachine implements IOrderTransitionPolicy {
  private readonly allowedTransitions: Record<OrderStatusType, OrderStatusType[]> = {
    Draft: ['Pending', 'Cancelled'],
    Pending: ['Confirmed', 'Cancelled'],
    Confirmed: ['Preparing', 'Cancelled'],
    Preparing: ['Ready', 'Cancelled'],
    Ready: ['Completed'],
    Completed: ['Refunded'],
    Cancelled: ['Refunded'],
    Refunded: [], // Terminal
  };

  public canTransition(from: OrderState, to: OrderState): boolean {
    const allowed = this.allowedTransitions[from.value];
    if (!allowed) {
      return false;
    }
    return allowed.includes(to.value);
  }

  public transition(from: OrderState, to: OrderState): OrderState {
    if (!this.canTransition(from, to)) {
      throw new Error(`Illegal state transition from ${from.value} to ${to.value}`);
    }
    return to;
  }
}
