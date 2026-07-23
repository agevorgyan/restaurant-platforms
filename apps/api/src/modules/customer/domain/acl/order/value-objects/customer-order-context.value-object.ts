import { ValueObject } from '@saas/core';
import { CustomerReference } from '../../../value-objects/customer-reference.value-object';
import { OrderReference } from '../../../value-objects/order-reference.value-object';
import { BranchReference } from '../../../value-objects/branch-reference.value-object';
import { CustomerOrderCorrelationId } from './customer-order-correlation-id.value-object';

export interface CustomerOrderContextProps {
  correlationId: CustomerOrderCorrelationId;
  customerRef: CustomerReference;
  orderRef: OrderReference;
  branchRef?: BranchReference;
  salesChannel?: string;
  businessDateTime: Date;
}

export class CustomerOrderContext extends ValueObject<CustomerOrderContextProps> {
  get correlationId(): CustomerOrderCorrelationId { return this.props.correlationId; }
  get customerRef(): CustomerReference { return this.props.customerRef; }
  get orderRef(): OrderReference { return this.props.orderRef; }
  get branchRef(): BranchReference | undefined { return this.props.branchRef; }
  get salesChannel(): string | undefined { return this.props.salesChannel; }
  get businessDateTime(): Date { return this.props.businessDateTime; }

  private constructor(props: CustomerOrderContextProps) { super(props); }
  public static create(props: CustomerOrderContextProps): CustomerOrderContext {
    return new CustomerOrderContext(props);
  }
}