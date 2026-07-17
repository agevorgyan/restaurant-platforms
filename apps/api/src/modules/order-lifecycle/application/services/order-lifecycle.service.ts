import { Injectable, BadRequestException } from '@nestjs/common';
import { OrderStateMachine } from '../../domain/services/order-state-machine.service';
import { OrderState } from '../../domain/value-objects/order-state.value-object';
import { TransitionHistoryRecord } from '../../domain/value-objects/transition-history-record.value-object';
import { TransitionOrderDto } from '../dto/order-lifecycle.dto';
import { validateTransitionOrder } from '../validation/order-lifecycle.schema';
import {
  OrderConfirmedEvent,
  OrderPreparingEvent,
  OrderReadyEvent,
  OrderCompletedEvent,
  OrderCancelledEvent,
  OrderRefundedEvent,
  OrderTransitionedEvent
} from '../../domain/events/order-lifecycle.events';

@Injectable()
export class OrderLifecycleService {
  constructor(private readonly stateMachine: OrderStateMachine) {}

  public transition(
    currentStateString: string,
    dto: TransitionOrderDto
  ): { newState: OrderState; record: TransitionHistoryRecord } {
    
    const errors = validateTransitionOrder(dto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    const currentState = new OrderState(currentStateString as any);
    const targetState = new OrderState(dto.targetState);

    // This throws an Error if the transition is illegal (Business Rule: Illegal transitions must be rejected)
    const newState = this.stateMachine.transition(currentState, targetState);

    // Record transition (Business Rule: Transition timestamps must be recorded)
    const record = new TransitionHistoryRecord(
      currentState,
      newState,
      new Date(),
      dto.reason,
      dto.userId
    );

    // Business Rule: Every successful transition must raise a domain event
    this.publishEvent(dto.orderId, record);

    return { newState, record };
  }

  private publishEvent(orderId: string, record: TransitionHistoryRecord): void {
    const to = record.toState.value;

    switch (to) {
      case 'Confirmed':
        new OrderConfirmedEvent(orderId, record);
        break;
      case 'Preparing':
        new OrderPreparingEvent(orderId, record);
        break;
      case 'Ready':
        new OrderReadyEvent(orderId, record);
        break;
      case 'Completed':
        new OrderCompletedEvent(orderId, record);
        break;
      case 'Cancelled':
        new OrderCancelledEvent(orderId, record);
        break;
      case 'Refunded':
        new OrderRefundedEvent(orderId, record);
        break;
      default:
        // Generic transition event for Draft/Pending if needed
        new OrderTransitionedEvent(orderId, record);
        break;
    }
  }
}
