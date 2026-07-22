import { ValueObject } from '@saas/core';
import { Quantity } from './quantity.value-object';

export interface MinimumStockProps {
  quantity: Quantity;
}

export class MinimumStock extends ValueObject<MinimumStockProps> {
  private constructor(props: MinimumStockProps) {
    super(props);
  }

  public static create(quantity: Quantity): MinimumStock {
    return new MinimumStock({ quantity });
  }

  get quantity(): Quantity {
    return this.props.quantity;
  }
}
