import { ValueObject } from '@saas/core';
import { Quantity } from './quantity.value-object';

export interface MaximumStockProps {
  quantity: Quantity;
}

export class MaximumStock extends ValueObject<MaximumStockProps> {
  private constructor(props: MaximumStockProps) {
    super(props);
  }

  public static create(quantity: Quantity): MaximumStock {
    return new MaximumStock({ quantity });
  }

  get quantity(): Quantity {
    return this.props.quantity;
  }
}
