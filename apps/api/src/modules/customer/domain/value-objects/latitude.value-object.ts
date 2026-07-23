import { ValueObject } from '@saas/core';

export interface LatitudeProps { value: number; }

export class Latitude extends ValueObject<LatitudeProps> {
  get value(): number { return this.props.value; }
  private constructor(props: LatitudeProps) { super(props); }
  public static create(value: number): Latitude {
    if (value < -90 || value > 90) throw new Error('Invalid latitude');
    return new Latitude({ value });
  }
}