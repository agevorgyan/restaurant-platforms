import { ValueObject } from '@saas/core';

export interface OrderActivityReferenceProps { activityId: string; }

export class OrderActivityReference extends ValueObject<OrderActivityReferenceProps> {
  get activityId(): string { return this.props.activityId; }
  private constructor(props: OrderActivityReferenceProps) { super(props); }
  public static create(activityId: string): OrderActivityReference {
    return new OrderActivityReference({ activityId });
  }
}