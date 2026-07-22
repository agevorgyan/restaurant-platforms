import { ValueObject } from '@saas/core';

export interface FinishedProductReferenceProps {
  productId: string;
}

export class FinishedProductReference extends ValueObject<FinishedProductReferenceProps> {
  get productId(): string {
    return this.props.productId;
  }

  private constructor(props: FinishedProductReferenceProps) {
    super(props);
  }

  public static create(productId: string): FinishedProductReference {
    if (!productId || productId.trim().length === 0) {
      throw new Error('Finished product reference ID cannot be empty');
    }
    return new FinishedProductReference({ productId: productId.trim() });
  }
}
