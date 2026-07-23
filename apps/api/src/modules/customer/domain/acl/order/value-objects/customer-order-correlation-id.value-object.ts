import { ValueObject } from '@saas/core';

export interface CustomerOrderCorrelationIdProps { value: string; }

export class CustomerOrderCorrelationId extends ValueObject<CustomerOrderCorrelationIdProps> {
  get value(): string { return this.props.value; }
  private constructor(props: CustomerOrderCorrelationIdProps) { super(props); }
  public static create(value?: string): CustomerOrderCorrelationId {
    return new CustomerOrderCorrelationId({ value: value || crypto.randomUUID() });
  }
}