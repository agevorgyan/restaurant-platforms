import { Money } from './money.value-object';

export class PricingBreakdown {
  constructor(
    public readonly subtotal: Money,
    public readonly modifierTotal: Money,
    public readonly discountTotal: Money,
    public readonly serviceChargeTotal: Money,
    public readonly deliveryFee: Money,
    public readonly taxTotal: Money,
    public readonly tipTotal: Money,
    public readonly grandTotal: Money,
    public readonly currency: string
  ) {
    this.validate();
  }

  private validate(): void {
    if (this.grandTotal.isNegative()) {
      throw new Error('Grand total must never be negative');
    }
  }
}
