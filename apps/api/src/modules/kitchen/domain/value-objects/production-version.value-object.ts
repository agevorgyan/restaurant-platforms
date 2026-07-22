import { ValueObject } from '@saas/core';

export interface ProductionVersionProps {
  value: number;
}

export class ProductionVersion extends ValueObject<ProductionVersionProps> {
  get value(): number {
    return this.props.value;
  }

  private constructor(props: ProductionVersionProps) {
    super(props);
  }

  public static create(value: number): ProductionVersion {
    if (value < 1) {
      throw new Error('Production version must be at least 1');
    }
    return new ProductionVersion({ value });
  }

  public increment(): ProductionVersion {
    return new ProductionVersion({ value: this.props.value + 1 });
  }
}
