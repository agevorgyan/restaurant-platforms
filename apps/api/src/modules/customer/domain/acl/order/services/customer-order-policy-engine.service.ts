import { CustomerOrderContext } from '../value-objects/customer-order-context.value-object';
import { CustomerOrderValidationPolicy } from '../policies/order-acl.policies';

export class CustomerOrderPolicyEngine {
  public evaluatePreConditions(context: CustomerOrderContext): void {
    CustomerOrderValidationPolicy.validate(context);
  }
}