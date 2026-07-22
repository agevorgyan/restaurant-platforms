import { ValueObject } from '@saas/core';
import { Quantity } from './quantity.value-object';

export interface AvailableQuantityProps {
  quantity: Quantity;
}

export class AvailableQuantity extends ValueObject<AvailableQuantityProps> {
  get quantity(): Quantity {
    return this.props.quantity;
  }

  private constructor(props: AvailableQuantityProps) {
    super(props);
  }

  public static create(quantity: Quantity): AvailableQuantity {
    if (quantity.value < 0) {
      throw new Error('Available quantity cannot be negative');
    }
    return new AvailableQuantity({ quantity });
  }

  public static calculate(onHand: Quantity, reserved: Quantity): AvailableQuantity {
    if (reserved.isGreaterThan(onHand)) {
      throw new Error('Reserved quantity cannot exceed on-hand quantity');
    }
    return AvailableQuantity.create(onHand.subtract(reserved));
  }
}
