import { ValueObject } from '@saas/core';

export interface ShippingAddressProps { street: string; city: string; state?: string; zip: string; country: string; }

export class ShippingAddress extends ValueObject<ShippingAddressProps> {
  get street(): string { return this.props.street; }
  get city(): string { return this.props.city; }
  get state(): string | undefined { return this.props.state; }
  get zip(): string { return this.props.zip; }
  get country(): string { return this.props.country; }
  private constructor(props: ShippingAddressProps) { super(props); }
  public static create(props: ShippingAddressProps): ShippingAddress {
    if (!props.street || !props.city || !props.zip || !props.country) throw new Error('Missing required shipping address fields');
    return new ShippingAddress(props);
  }
}