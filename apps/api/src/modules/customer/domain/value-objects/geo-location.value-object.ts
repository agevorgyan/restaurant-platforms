import { ValueObject } from '@saas/core';
import { Latitude } from './latitude.value-object';
import { Longitude } from './longitude.value-object';

export interface GeoLocationProps { lat: Latitude; lng: Longitude; }

export class GeoLocation extends ValueObject<GeoLocationProps> {
  get lat(): Latitude { return this.props.lat; }
  get lng(): Longitude { return this.props.lng; }
  private constructor(props: GeoLocationProps) { super(props); }
  public static create(lat: Latitude, lng: Longitude): GeoLocation {
    return new GeoLocation({ lat, lng });
  }
}