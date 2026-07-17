import { OrderState } from '../value-objects/order-state.value-object';

export interface IOrderTransitionPolicy {
  canTransition(from: OrderState, to: OrderState): boolean;
}
