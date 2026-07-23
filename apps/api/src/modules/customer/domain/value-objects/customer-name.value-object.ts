import { ValueObject } from '@saas/core';

export interface CustomerNameProps { firstName: string; lastName: string; }

export class CustomerName extends ValueObject<CustomerNameProps> {
  get firstName(): string { return this.props.firstName; }
  get lastName(): string { return this.props.lastName; }
  private constructor(props: CustomerNameProps) { super(props); }
  public static create(firstName: string, lastName: string): CustomerName {
    if (!firstName || !lastName) throw new Error('First and last name are required');
    return new CustomerName({ firstName, lastName });
  }
}