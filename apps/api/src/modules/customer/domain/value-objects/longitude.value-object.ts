import { ValueObject } from '@saas/core';

export interface LongitudeProps { value: number; }

export class Longitude extends ValueObject<LongitudeProps> {
  get value(): number { return this.props.value; }
  private constructor(props: LongitudeProps) { super(props); }
  public static create(value: number): Longitude {
    if (value < -180 || value > 180) throw new Error('Invalid longitude');
    return new Longitude({ value });
  }
}