import { ValueObject } from '@saas/core';

export interface ProductionDurationProps {
  minutes: number;
}

export class ProductionDuration extends ValueObject<ProductionDurationProps> {
  get minutes(): number {
    return this.props.minutes;
  }

  private constructor(props: ProductionDurationProps) {
    super(props);
  }

  public static create(minutes: number): ProductionDuration {
    if (minutes < 0) {
      throw new Error('Production duration cannot be negative');
    }
    return new ProductionDuration({ minutes });
  }
}
