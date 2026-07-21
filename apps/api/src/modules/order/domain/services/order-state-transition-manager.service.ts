import { Order } from '../aggregates/order.aggregate';
import { OrderStatusEnum } from '../value-objects/order-status.value-object';
import { OrderStateMachine } from './order-state-machine.service';
import { OrderTransition } from '../value-objects/order-transition.value-object';
import { TransitionReason } from '../value-objects/transition-reason.value-object';
import { TransitionMetadata } from '../value-objects/transition-metadata.value-object';
import {
  OrderStatusChangedEvent,
  OrderConfirmedEvent,
  OrderPreparedEvent,
  OrderReadyEvent,
  OrderDispatchedEvent,
  OrderDeliveredEvent,
  OrderCompletedEvent,
  OrderCancelledEvent,
  OrderRejectedEvent
} from '../events/order.events';

export type TransitionResult = 
  | { isSuccess: true; value: OrderTransition }
  | { isFailure: true; error: string };

export class OrderStateTransitionManager {
  private readonly stateMachine: OrderStateMachine;

  constructor() {
    this.stateMachine = new OrderStateMachine();
  }

  /**
   * Orchestrates the transition: validates, applies, and generates the transition record + events.
   */
  public transitionOrder(
    order: Order,
    nextStatus: OrderStatusEnum,
    reasonStr?: string,
    metadataRecord?: Record<string, any>
  ): TransitionResult {
    const fromStatus = order.status;
    
    // Attempt state machine apply
    const applyResult = this.stateMachine.applyTransition(order, nextStatus);
    if ('isFailure' in applyResult) {
      return { isFailure: true, error: applyResult.error };
    }

    // Generate transition value object
    const reason = reasonStr ? TransitionReason.create(reasonStr) : undefined;
    const metadata = TransitionMetadata.create(metadataRecord);
    const transition = OrderTransition.create({
      fromStatus,
      toStatus: order.status,
      reason,
      metadata
    });

    // If idempotent (no real change), don't emit events
    if (fromStatus.value !== nextStatus) {
      this.dispatchEvents(order, fromStatus.value, nextStatus, reasonStr);
    }

    return { isSuccess: true, value: transition };
  }

  private dispatchEvents(order: Order, from: OrderStatusEnum, to: OrderStatusEnum, reason?: string): void {
    // 1. Generic status changed event

    (order as any).addDomainEvent(
      new OrderStatusChangedEvent(order.id, order.restaurantId.value, from, to)
    );

    // 2. Specific semantic events
    switch (to) {
      case OrderStatusEnum.CONFIRMED:
    
        (order as any).addDomainEvent(new OrderConfirmedEvent(order.id, order.restaurantId.value));
        break;
      case OrderStatusEnum.PREPARING:
    
        (order as any).addDomainEvent(new OrderPreparedEvent(order.id, order.restaurantId.value));
        break;
      case OrderStatusEnum.READY:
    
        (order as any).addDomainEvent(new OrderReadyEvent(order.id, order.restaurantId.value));
        break;
      case OrderStatusEnum.OUT_FOR_DELIVERY:
    
        (order as any).addDomainEvent(new OrderDispatchedEvent(order.id, order.restaurantId.value));
        break;
      case OrderStatusEnum.DELIVERED:
    
        (order as any).addDomainEvent(new OrderDeliveredEvent(order.id, order.restaurantId.value));
        break;
      case OrderStatusEnum.COMPLETED:
    
        (order as any).addDomainEvent(new OrderCompletedEvent(order.id, order.restaurantId.value));
        break;
      case OrderStatusEnum.CANCELLED:
    
        (order as any).addDomainEvent(new OrderCancelledEvent(order.id, order.restaurantId.value, reason || 'No reason provided'));
        break;
      case OrderStatusEnum.REJECTED:
    
        (order as any).addDomainEvent(new OrderRejectedEvent(order.id, order.restaurantId.value, reason || 'No reason provided'));
        break;
    }
  }
}
