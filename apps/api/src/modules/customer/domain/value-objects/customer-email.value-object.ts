import { ValueObject } from '@saas/core';

export interface CustomerEmailProps { value: string; }

export class CustomerEmail extends ValueObject<CustomerEmailProps> {
  get value(): string { return this.props.value; }
  private constructor(props: CustomerEmailProps) { super(props); }
  public static create(value: string): CustomerEmail {
    if (!value || !value.includes('@')) throw new Error('Invalid email format');
    return new CustomerEmail({ value });
  }
}