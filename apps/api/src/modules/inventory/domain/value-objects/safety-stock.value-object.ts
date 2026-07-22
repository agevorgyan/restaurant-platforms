import { ValueObject } from '@saas/core';
import { Quantity } from './quantity.value-object';

export interface SafetyStockProps {
  quantity: Quantity;
}

export class SafetyStock extends ValueObject<SafetyStockProps> {
  private constructor(props: SafetyStockProps) {
    super(props);
  }

  public static create(quantity: Quantity): SafetyStock {
    return new SafetyStock({ quantity });
  }

  get quantity(): Quantity {
    return this.props.quantity;
  }
}
