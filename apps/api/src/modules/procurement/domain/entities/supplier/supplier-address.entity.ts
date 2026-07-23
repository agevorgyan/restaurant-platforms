import { Entity } from '@saas/core';

export interface SupplierAddressProps {
  street1: string;
  street2?: string;
  city: string;
  stateProvince: string;
  postalCode: string;
  countryCode: string; // ISO 3166-1 alpha-2
  isPrimary: boolean;
}

export class SupplierAddress extends Entity<SupplierAddressProps> {
  get street1(): string { return this.props.street1; }
  get street2(): string | undefined { return this.props.street2; }
  get city(): string { return this.props.city; }
  get stateProvince(): string { return this.props.stateProvince; }
  get postalCode(): string { return this.props.postalCode; }
  get countryCode(): string { return this.props.countryCode; }
  get isPrimary(): boolean { return this.props.isPrimary; }

  private constructor(props: SupplierAddressProps, id?: string) {
    super(id || crypto.randomUUID(), props);
  }

  public static create(props: SupplierAddressProps, id?: string): SupplierAddress {
    if (!props.street1 || props.street1.trim() === '') throw new Error('street1 is required');
    if (!props.city || props.city.trim() === '') throw new Error('city is required');
    if (!props.countryCode || props.countryCode.length !== 2) throw new Error('Valid 2-letter countryCode is required');
    
    return new SupplierAddress(props, id);
  }

  public setPrimary(isPrimary: boolean): void {
    this.props.isPrimary = isPrimary;
  }
}
