import { Money } from './money.value-object';

export type AdjustmentType = 'Discount' | 'Tax' | 'ServiceCharge' | 'DeliveryFee' | 'Tip';

export class PriceAdjustment {
  constructor(
    public readonly name: string,
    public readonly amount: Money,
    public readonly type: AdjustmentType
  ) {
    this.validate();
  }

  private validate(): void {
    if (this.amount.isNegative() && this.type !== 'Discount') {
      throw new Error(`${this.type} cannot be negative`);
    }
  }
}
