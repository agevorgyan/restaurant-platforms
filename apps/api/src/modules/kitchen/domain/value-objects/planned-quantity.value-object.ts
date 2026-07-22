import { ValueObject } from '@saas/core';
import { Quantity } from '../../../inventory/domain/value-objects/quantity.value-object';

export interface PlannedQuantityProps {
  quantity: Quantity;
}

export class PlannedQuantity extends ValueObject<PlannedQuantityProps> {
  get quantity(): Quantity {
    return this.props.quantity;
  }

  private constructor(props: PlannedQuantityProps) {
    super(props);
  }

  public static create(quantity: Quantity): PlannedQuantity {
    if (quantity.value < 0) {
      throw new Error('Planned quantity cannot be negative');
    }
    return new PlannedQuantity({ quantity });
  }
}
