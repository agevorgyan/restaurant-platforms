export type PromotionTypeEnum = 'Percentage' | 'FixedAmount' | 'BuyXGetY' | 'FreeItem' | 'FreeDelivery';

export class PromotionType {
  constructor(public readonly value: PromotionTypeEnum) {
    this.validate(value);
  }

  private validate(type: string): void {
    const valid = ['Percentage', 'FixedAmount', 'BuyXGetY', 'FreeItem', 'FreeDelivery'];
    if (!valid.includes(type)) {
      throw new Error(`Invalid Promotion Type: ${type}`);
    }
  }
}
