import { ValueObject } from '@saas/core';
import { OrderStatus } from './order-status.value-object';
import { TransitionReason } from './transition-reason.value-object';
import { TransitionMetadata } from './transition-metadata.value-object';
import { TransitionTimestamp } from './transition-timestamp.value-object';

export interface OrderTransitionProps {
  fromStatus: OrderStatus;
  toStatus: OrderStatus;
  reason?: TransitionReason;
  metadata: TransitionMetadata;
  timestamp: TransitionTimestamp;
}

export class OrderTransition extends ValueObject<OrderTransitionProps> {
  private constructor(props: OrderTransitionProps) {
    super(props);
  }

  public static create(props: Omit<OrderTransitionProps, 'timestamp'> & { timestamp?: TransitionTimestamp }): OrderTransition {
    return new OrderTransition({
      fromStatus: props.fromStatus,
      toStatus: props.toStatus,
      reason: props.reason,
      metadata: props.metadata,
      timestamp: props.timestamp ?? TransitionTimestamp.now()
    });
  }

  get fromStatus(): OrderStatus { return this.props.fromStatus; }
  get toStatus(): OrderStatus { return this.props.toStatus; }
  get reason(): TransitionReason | undefined { return this.props.reason; }
  get metadata(): TransitionMetadata { return this.props.metadata; }
  get timestamp(): TransitionTimestamp { return this.props.timestamp; }
}
