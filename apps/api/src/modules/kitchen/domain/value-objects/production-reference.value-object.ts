import { ValueObject } from '@saas/core';

export interface ProductionReferenceProps {
  productionId: string;
}

export class ProductionReference extends ValueObject<ProductionReferenceProps> {
  get productionId(): string {
    return this.props.productionId;
  }

  private constructor(props: ProductionReferenceProps) {
    super(props);
  }

  public static create(productionId: string): ProductionReference {
    if (!productionId || productionId.trim().length === 0) {
      throw new Error('Production reference ID cannot be empty');
    }
    return new ProductionReference({ productionId: productionId.trim() });
  }
}
