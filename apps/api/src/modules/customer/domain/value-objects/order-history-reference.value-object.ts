import { ValueObject } from '@saas/core';

export interface OrderHistoryReferenceProps { historyId: string; }

export class OrderHistoryReference extends ValueObject<OrderHistoryReferenceProps> {
  get historyId(): string { return this.props.historyId; }
  private constructor(props: OrderHistoryReferenceProps) { super(props); }
  public static create(historyId: string): OrderHistoryReference {
    return new OrderHistoryReference({ historyId });
  }
}