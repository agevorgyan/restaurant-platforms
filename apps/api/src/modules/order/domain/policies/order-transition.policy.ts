import { Order } from '../aggregates/order.aggregate';
import { OrderStatusEnum } from '../value-objects/order-status.value-object';
import { ValidOrderTransitionSpecification } from '../specifications/valid-order-transition.specification';

export class OrderTransitionPolicy {
  private readonly validTransitionSpec: ValidOrderTransitionSpecification;

  constructor() {
    this.validTransitionSpec = new ValidOrderTransitionSpecification();
  }

  public canTransition(order: Order, nextStatus: OrderStatusEnum): boolean {
    // If it's already in the target status, policy might dictate it's technically fine (idempotent),
    // but the actual mutation will just be skipped.
    if (order.status.value === nextStatus) {
      return true;
    }

    if (this.validTransitionSpec.isTerminal(order.status.value)) {
      return false; // Terminal states cannot transition
    }

    return this.validTransitionSpec.isSatisfiedBy(order, nextStatus);
  }
}
