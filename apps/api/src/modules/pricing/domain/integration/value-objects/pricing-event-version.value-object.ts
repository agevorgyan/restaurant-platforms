import { ValueObject } from '@saas/core';

export interface PricingEventVersionProps {
  value: number;
}

export class PricingEventVersion extends ValueObject<PricingEventVersionProps> {
  private constructor(props: PricingEventVersionProps) {
    super(props);
  }

  public static create(value: number): PricingEventVersion {
    if (value <= 0) {
      throw new Error('Event version must be greater than zero');
    }
    return new PricingEventVersion({ value });
  }

  public static initial(): PricingEventVersion {
    return new PricingEventVersion({ value: 1 });
  }

  get value(): number {
    return this.props.value;
  }
}
