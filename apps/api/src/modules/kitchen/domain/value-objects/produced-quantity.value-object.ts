import { ValueObject } from '@saas/core';
import { Quantity } from '../../../inventory/domain/value-objects/quantity.value-object';

export interface ProducedQuantityProps {
  quantity: Quantity;
}

export class ProducedQuantity extends ValueObject<ProducedQuantityProps> {
  get quantity(): Quantity {
    return this.props.quantity;
  }

  private constructor(props: ProducedQuantityProps) {
    super(props);
  }

  public static create(quantity: Quantity): ProducedQuantity {
    if (quantity.value < 0) {
      throw new Error('Produced quantity cannot be negative');
    }
    return new ProducedQuantity({ quantity });
  }
}
