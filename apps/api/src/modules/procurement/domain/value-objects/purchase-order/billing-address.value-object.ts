import { ValueObject } from '@saas/core';

export interface BillingAddressProps { street: string; city: string; state?: string; zip: string; country: string; }

export class BillingAddress extends ValueObject<BillingAddressProps> {
  get street(): string { return this.props.street; }
  get city(): string { return this.props.city; }
  get state(): string | undefined { return this.props.state; }
  get zip(): string { return this.props.zip; }
  get country(): string { return this.props.country; }
  private constructor(props: BillingAddressProps) { super(props); }
  public static create(props: BillingAddressProps): BillingAddress {
    if (!props.street || !props.city || !props.zip || !props.country) throw new Error('Missing required billing address fields');
    return new BillingAddress(props);
  }
}