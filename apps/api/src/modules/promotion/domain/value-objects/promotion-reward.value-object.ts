import { PromotionTypeEnum } from './promotion-type.value-object';

export class PromotionReward {
  constructor(
    public readonly type: PromotionTypeEnum,
    public readonly value?: number,
    public readonly buyQuantity?: number,
    public readonly getQuantity?: number,
    public readonly rewardProductId?: string
  ) {
    this.validate();
  }

  private validate(): void {
    if (this.type === 'Percentage') {
      if (this.value === undefined || this.value < 0 || this.value > 100) {
        throw new Error('Percentage discount must be between 0 and 100');
      }
    }

    if (this.type === 'FixedAmount') {
      if (this.value === undefined || this.value <= 0) {
        throw new Error('Fixed amount must be greater than zero');
      }
    }

    if (this.type === 'BuyXGetY') {
      if (this.buyQuantity === undefined || this.buyQuantity <= 0 || this.getQuantity === undefined || this.getQuantity <= 0) {
        throw new Error('BuyXGetY requires valid buy and reward quantities');
      }
    }
  }
}
