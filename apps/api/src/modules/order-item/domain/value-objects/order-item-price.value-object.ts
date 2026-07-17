import { OrderItemModifier } from './order-item-modifier.value-object';

export class OrderItemPrice {
  public readonly totalPrice: number;

  constructor(
    public readonly unitPrice: number,
    public readonly quantity: number,
    public readonly modifiers: OrderItemModifier[] = []
  ) {
    this.validate();
    this.totalPrice = this.calculateTotal();
  }

  private validate(): void {
    if (this.unitPrice < 0) {
      throw new Error('Unit price cannot be negative');
    }
    if (this.quantity <= 0) {
      throw new Error('Quantity must be greater than zero');
    }
  }

  private calculateTotal(): number {
    const modifiersTotal = this.modifiers.reduce(
      (sum, mod) => sum + mod.priceAdjustment * mod.quantity,
      0
    );

    // Total price = (unit price × quantity) + modifier adjustments (scaled by quantity)
    return (this.unitPrice * this.quantity) + (modifiersTotal * this.quantity);
  }
}
