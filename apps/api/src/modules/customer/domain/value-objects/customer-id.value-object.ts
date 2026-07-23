import { ValueObject } from '@saas/core';

export interface CustomerIdProps { value: string; }

export class CustomerId extends ValueObject<CustomerIdProps> {
  get value(): string { return this.props.value; }
  private constructor(props: CustomerIdProps) { super(props); }
  public static create(value?: string): CustomerId {
    return new CustomerId({ value: value || crypto.randomUUID() });
  }
}