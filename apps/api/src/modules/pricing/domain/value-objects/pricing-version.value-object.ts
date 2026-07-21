import { ValueObject } from '@saas/core';

export interface PricingVersionProps {
  value: number;
}

export class PricingVersion extends ValueObject<PricingVersionProps> {
  private constructor(props: PricingVersionProps) {
    super(props);
  }

  public static initial(): PricingVersion {
    return new PricingVersion({ value: 1 });
  }

  public next(): PricingVersion {
    return new PricingVersion({ value: this.props.value + 1 });
  }

  get value(): number {
    return this.props.value;
  }
}
