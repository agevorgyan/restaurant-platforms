import { ValueObject } from '@saas/core';

export interface CityProps { name: string; }

export class City extends ValueObject<CityProps> {
  get name(): string { return this.props.name; }
  private constructor(props: CityProps) { super(props); }
  public static create(name: string): City {
    return new City({ name });
  }
}