import { OrderReference } from '../../../value-objects/order-reference.value-object';

export class OrderReferenceValidator {
  public validate(ref: OrderReference): boolean {
    return !!ref && !!ref.orderId;
  }
}