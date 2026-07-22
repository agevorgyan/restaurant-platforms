import { ValueObject } from '@saas/core';
import { Quantity } from './quantity.value-object';

export interface ReorderLevelProps {
  quantity: Quantity;
}

export class ReorderLevel extends ValueObject<ReorderLevelProps> {
  private constructor(props: ReorderLevelProps) {
    super(props);
  }

  public static create(quantity: Quantity): ReorderLevel {
    return new ReorderLevel({ quantity });
  }

  get quantity(): Quantity {
    return this.props.quantity;
  }
}
