import { ValueObject } from '@saas/core';
import { Quantity } from './quantity.value-object';

export interface MovementQuantityProps {
  quantity: Quantity;
}

export class MovementQuantity extends ValueObject<MovementQuantityProps> {
  private constructor(props: MovementQuantityProps) {
    super(props);
  }

  public static create(quantity: Quantity): MovementQuantity {
    if (quantity.value <= 0) {
      throw new Error('Movement quantity must be greater than zero');
    }
    return new MovementQuantity({ quantity });
  }

  get quantity(): Quantity {
    return this.props.quantity;
  }
}
