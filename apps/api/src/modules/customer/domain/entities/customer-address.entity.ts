import { Entity } from '@saas/core';
import { AddressId } from '../value-objects/address-id.value-object';
import { AddressType } from '../value-objects/address-type.value-object';
import { AddressLabel } from '../value-objects/address-label.value-object';
import { CountryCode } from '../value-objects/country-code.value-object';
import { Region } from '../value-objects/region.value-object';
import { City } from '../value-objects/city.value-object';
import { Street } from '../value-objects/street.value-object';
import { Building } from '../value-objects/building.value-object';
import { PostalCode } from '../value-objects/postal-code.value-object';
import { GeoLocation } from '../value-objects/geo-location.value-object';
import { DeliveryInstructions } from '../value-objects/delivery-instructions.value-object';
import { AddressVerification } from './address-verification.entity';
import { BranchReference } from '../value-objects/branch-reference.value-object';
import { DeliveryZoneReference } from '../value-objects/delivery-zone-reference.value-object';

export interface CustomerAddressProps {
  addressId: AddressId;
  type: AddressType;
  label?: AddressLabel;
  countryCode: CountryCode;
  region?: Region;
  city: City;
  street: Street;
  building: Building;
  postalCode: PostalCode;
  geoLocation?: GeoLocation;
  deliveryInstructions?: DeliveryInstructions;
  verification: AddressVerification;
  isDefaultBilling: boolean;
  isDefaultDelivery: boolean;
  branchReference?: BranchReference;
  deliveryZoneReference?: DeliveryZoneReference;
}

export class CustomerAddress extends Entity<CustomerAddressProps> {
  get addressId(): AddressId { return this.props.addressId; }
  get type(): AddressType { return this.props.type; }
  get isDefaultDelivery(): boolean { return this.props.isDefaultDelivery; }
  get isDefaultBilling(): boolean { return this.props.isDefaultBilling; }
  get verification(): AddressVerification { return this.props.verification; }

  private constructor(id: string, props: CustomerAddressProps) { super(id, props); }
  public static create(props: CustomerAddressProps): CustomerAddress {
    return new CustomerAddress(props.addressId.value, props);
  }

  public update(props: Partial<CustomerAddressProps>): void {
    if (this.verification.status.status === 'VERIFIED') {
      throw new Error('Verified addresses cannot be modified directly');
    }
    Object.assign(this.props, props);
  }
}