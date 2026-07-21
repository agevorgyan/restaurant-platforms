import { Order } from '../aggregates/order.aggregate';
import { CompletableOrderSpecification } from '../specifications/completable-order.specification';

export class OrderCompletionPolicy {
  private readonly completableSpec: CompletableOrderSpecification;

  constructor() {
    this.completableSpec = new CompletableOrderSpecification();
  }

  public isSatisfiedBy(order: Order): boolean {
    return this.completableSpec.isSatisfiedBy(order);
  }
}
