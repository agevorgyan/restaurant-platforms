import { ValueObject } from '@saas/core';

export interface CustomerCodeProps { code: string; }

export class CustomerCode extends ValueObject<CustomerCodeProps> {
  get code(): string { return this.props.code; }
  private constructor(props: CustomerCodeProps) { super(props); }
  public static create(code: string): CustomerCode {
    if (!code) throw new Error('CustomerCode cannot be empty');
    return new CustomerCode({ code });
  }
}