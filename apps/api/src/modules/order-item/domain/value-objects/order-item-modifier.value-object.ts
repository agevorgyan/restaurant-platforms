export class OrderItemModifier {
  constructor(
    public readonly modifierGroupId: string,
    public readonly modifierOptionId: string,
    public readonly name: string,
    public readonly quantity: number,
    public readonly priceAdjustment: number
  ) {
    this.validate();
  }

  private validate(): void {
    if (this.quantity <= 0) {
      throw new Error('Modifier quantity must be greater than zero');
    }
  }
}
