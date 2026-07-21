import { ValueObject } from '@saas/core';

export interface DeliveryAddressProps {
  country: string;
  city: string;
  region: string;
  street: string;
  building: string;
  apartment?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  instructions?: string;
}

export class DeliveryAddress extends ValueObject<DeliveryAddressProps> {
  private constructor(props: DeliveryAddressProps) {
    super(props);
  }

  public static create(props: DeliveryAddressProps): DeliveryAddress {
    if (!props.country || !props.city || !props.region || !props.street || !props.building) {
      throw new Error('Delivery address is missing mandatory fields');
    }

    if (props.latitude !== undefined && (props.latitude < -90 || props.latitude > 90)) {
      throw new Error('Invalid latitude coordinate');
    }

    if (props.longitude !== undefined && (props.longitude < -180 || props.longitude > 180)) {
      throw new Error('Invalid longitude coordinate');
    }

    return new DeliveryAddress({
      country: props.country.trim(),
      city: props.city.trim(),
      region: props.region.trim(),
      street: props.street.trim(),
      building: props.building.trim(),
      apartment: props.apartment?.trim(),
      postalCode: props.postalCode?.trim(),
      latitude: props.latitude,
      longitude: props.longitude,
      instructions: props.instructions?.trim()
    });
  }

  get country(): string { return this.props.country; }
  get city(): string { return this.props.city; }
  get region(): string { return this.props.region; }
  get street(): string { return this.props.street; }
  get building(): string { return this.props.building; }
  get apartment(): string | undefined { return this.props.apartment; }
  get postalCode(): string | undefined { return this.props.postalCode; }
  get latitude(): number | undefined { return this.props.latitude; }
  get longitude(): number | undefined { return this.props.longitude; }
  get instructions(): string | undefined { return this.props.instructions; }
}
