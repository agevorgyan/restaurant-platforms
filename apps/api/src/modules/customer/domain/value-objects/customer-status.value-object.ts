import { ValueObject } from '@saas/core';
import { CustomerStatus } from '../enums/customer.enums';

export interface CustomerStatusVoProps { status: CustomerStatus; }

export class CustomerStatusVo extends ValueObject<CustomerStatusVoProps> {
  get status(): CustomerStatus { return this.props.status; }
  private constructor(props: CustomerStatusVoProps) { super(props); }
  public static create(status: CustomerStatus): CustomerStatusVo {
    return new CustomerStatusVo({ status });
  }
}