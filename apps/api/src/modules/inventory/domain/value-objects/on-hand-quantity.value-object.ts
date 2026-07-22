import { ValueObject } from '@saas/core';
import { Quantity } from './quantity.value-object';
import { UnitPrecision } from './unit-precision.value-object';

export interface OnHandQuantityProps {
  quantity: Quantity;
}

export class OnHandQuantity extends ValueObject<OnHandQuantityProps> {
  get quantity(): Quantity {
    return this.props.quantity;
  }

  private constructor(props: OnHandQuantityProps) {
    super(props);
  }

  public static create(quantity: Quantity): OnHandQuantity {
    if (quantity.value < 0) {
      throw new Error('On-hand quantity cannot be negative');
    }
    return new OnHandQuantity({ quantity });
  }

  public static initial(precision: UnitPrecision): OnHandQuantity {
    return new OnHandQuantity({ quantity: Quantity.create(0, precision) });
  }

  public add(amount: Quantity): OnHandQuantity {
    return OnHandQuantity.create(this.quantity.add(amount));
  }

  public subtract(amount: Quantity): OnHandQuantity {
    return OnHandQuantity.create(this.quantity.subtract(amount));
  }
}
