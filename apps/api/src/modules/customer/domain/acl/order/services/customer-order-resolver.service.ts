import { CustomerOrderContext } from '../value-objects/customer-order-context.value-object';

export class CustomerOrderResolver {
  public resolveTargetEndpoint(context: CustomerOrderContext): string {
    void context;
    return 'order-service.internal';
  }
}