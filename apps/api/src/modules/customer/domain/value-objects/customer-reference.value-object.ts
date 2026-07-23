import { ValueObject } from '@saas/core';

export interface CustomerReferenceProps { customerId: string; }

export class CustomerReference extends ValueObject<CustomerReferenceProps> {
  get customerId(): string { return this.props.customerId; }
  private constructor(props: CustomerReferenceProps) { super(props); }
  public static create(customerId: string): CustomerReference {
    if (!customerId) throw new Error('CustomerReference cannot be empty');
    return new CustomerReference({ customerId });
  }
}