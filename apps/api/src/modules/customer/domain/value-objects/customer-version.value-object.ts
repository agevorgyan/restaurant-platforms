import { ValueObject } from '@saas/core';

export interface CustomerVersionProps { version: number; }

export class CustomerVersion extends ValueObject<CustomerVersionProps> {
  get version(): number { return this.props.version; }
  private constructor(props: CustomerVersionProps) { super(props); }
  public static create(version: number = 1): CustomerVersion {
    return new CustomerVersion({ version });
  }
}