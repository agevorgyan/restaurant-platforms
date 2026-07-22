import { ValueObject } from '@saas/core';

export interface ProductionNumberProps {
  value: string;
}

export class ProductionNumber extends ValueObject<ProductionNumberProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: ProductionNumberProps) {
    super(props);
  }

  public static create(value: string): ProductionNumber {
    if (!value || value.trim().length === 0) {
      throw new Error('Production number cannot be empty');
    }
    return new ProductionNumber({ value: value.trim() });
  }
}
