import { ValueObject } from '@saas/core';

export interface CustomerPhoneProps { value: string; }

export class CustomerPhone extends ValueObject<CustomerPhoneProps> {
  get value(): string { return this.props.value; }
  private constructor(props: CustomerPhoneProps) { super(props); }
  public static create(value: string): CustomerPhone {
    if (!value) throw new Error('Invalid phone format');
    return new CustomerPhone({ value });
  }
}