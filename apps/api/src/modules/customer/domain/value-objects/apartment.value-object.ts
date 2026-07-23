import { ValueObject } from '@saas/core';

export interface ApartmentProps { number: string; }

export class Apartment extends ValueObject<ApartmentProps> {
  get number(): string { return this.props.number; }
  private constructor(props: ApartmentProps) { super(props); }
  public static create(number: string): Apartment {
    return new Apartment({ number });
  }
}