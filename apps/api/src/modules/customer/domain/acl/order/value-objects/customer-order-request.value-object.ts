import { ValueObject } from '@saas/core';
import { CustomerOrderContext } from './customer-order-context.value-object';

export interface CustomerOrderRequestProps {
  context: CustomerOrderContext;
  action: string;
}

export class CustomerOrderRequest extends ValueObject<CustomerOrderRequestProps> {
  get context(): CustomerOrderContext { return this.props.context; }
  get action(): string { return this.props.action; }

  private constructor(props: CustomerOrderRequestProps) { super(props); }
  public static create(props: CustomerOrderRequestProps): CustomerOrderRequest {
    return new CustomerOrderRequest(props);
  }
}