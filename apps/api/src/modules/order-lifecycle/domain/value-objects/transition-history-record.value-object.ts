import { OrderState } from './order-state.value-object';

export class TransitionHistoryRecord {
  constructor(
    public readonly fromState: OrderState,
    public readonly toState: OrderState,
    public readonly timestamp: Date = new Date(),
    public readonly reason?: string,
    public readonly userId?: string
  ) {}
}
