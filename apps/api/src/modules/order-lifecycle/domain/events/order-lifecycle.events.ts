import { TransitionHistoryRecord } from '../value-objects/transition-history-record.value-object';

export class OrderTransitionedEvent {
  constructor(
    public readonly orderId: string,
    public readonly transition: TransitionHistoryRecord
  ) {}
}

export class OrderConfirmedEvent extends OrderTransitionedEvent {}
export class OrderPreparingEvent extends OrderTransitionedEvent {}
export class OrderReadyEvent extends OrderTransitionedEvent {}
export class OrderCompletedEvent extends OrderTransitionedEvent {}
export class OrderCancelledEvent extends OrderTransitionedEvent {}
export class OrderRefundedEvent extends OrderTransitionedEvent {}
