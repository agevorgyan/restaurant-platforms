import { ValueObject } from '@saas/core';

export interface CustomerEligibilityProps { isEligible: boolean; reason?: string; }
export class CustomerEligibility extends ValueObject<CustomerEligibilityProps> {
  get isEligible(): boolean { return this.props.isEligible; }
  get reason(): string | undefined { return this.props.reason; }
  private constructor(props: CustomerEligibilityProps) { super(props); }
  public static create(isEligible: boolean, reason?: string): CustomerEligibility { return new CustomerEligibility({ isEligible, reason }); }
}