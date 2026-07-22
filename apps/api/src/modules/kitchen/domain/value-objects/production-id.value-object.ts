import { ValueObject } from '@saas/core';

export interface ProductionIdProps {
  value: string;
}

export class ProductionId extends ValueObject<ProductionIdProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: ProductionIdProps) {
    super(props);
  }

  public static create(value?: string): ProductionId {
    return new ProductionId({
      value: value || crypto.randomUUID(),
    });
  }
}
