export class ModifierOptionPrice {
  constructor(
    public readonly priceAdjustment: number,
    public readonly currency: string
  ) {}

  public canApplyTo(basePrice: number): boolean {
    // Rule: Negative price adjustment must not reduce the final product price below zero.
    return basePrice + this.priceAdjustment >= 0;
  }
}
