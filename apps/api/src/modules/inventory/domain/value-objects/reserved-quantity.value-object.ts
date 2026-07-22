import { ValueObject } from '@saas/core';
import { Quantity } from './quantity.value-object';
import { UnitPrecision } from './unit-precision.value-object';

export interface ReservedQuantityProps {
  quantity: Quantity;
}

export class ReservedQuantity extends ValueObject<ReservedQuantityProps> {
  get quantity(): Quantity {
    return this.props.quantity;
  }

  private constructor(props: ReservedQuantityProps) {
    super(props);
  }

  public static create(quantity: Quantity): ReservedQuantity {
    if (quantity.value < 0) {
      throw new Error('Reserved quantity cannot be negative');
    }
    return new ReservedQuantity({ quantity });
  }

  public static initial(precision: UnitPrecision): ReservedQuantity {
    return new ReservedQuantity({ quantity: Quantity.create(0, precision) });
  }

  public add(amount: Quantity): ReservedQuantity {
    return ReservedQuantity.create(this.quantity.add(amount));
  }

  public subtract(amount: Quantity): ReservedQuantity {
    return ReservedQuantity.create(this.quantity.subtract(amount));
  }
}
