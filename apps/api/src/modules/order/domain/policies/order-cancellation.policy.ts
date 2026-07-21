import { Order } from '../aggregates/order.aggregate';
import { CancellableOrderSpecification } from '../specifications/cancellable-order.specification';

export class OrderCancellationPolicy {
  private readonly cancellableSpec: CancellableOrderSpecification;

  constructor() {
    this.cancellableSpec = new CancellableOrderSpecification();
  }

  public isSatisfiedBy(order: Order): boolean {
    return this.cancellableSpec.isSatisfiedBy(order);
  }
}
