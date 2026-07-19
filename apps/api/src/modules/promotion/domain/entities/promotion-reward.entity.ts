import { Entity } from '@saas/core';
import { PromotionTypeEnum } from '../value-objects/promotion-type.value-object';

export interface PromotionRewardProps {
  id: string;
  type: PromotionTypeEnum;
  value?: number;
  buyQuantity?: number;
  getQuantity?: number;
  rewardProductId?: string;
}

export class PromotionReward extends Entity<PromotionRewardProps> {
  private constructor(props: PromotionRewardProps) {
    super(props.id, props);
  }

  public get id(): string { return this.props.id; }
  public get type(): PromotionTypeEnum { return this.props.type; }
  public get value(): number | undefined { return this.props.value; }
  public get buyQuantity(): number | undefined { return this.props.buyQuantity; }
  public get getQuantity(): number | undefined { return this.props.getQuantity; }
  public get rewardProductId(): string | undefined { return this.props.rewardProductId; }

  public static create(props: PromotionRewardProps): PromotionReward {
    if (!props.id) throw new Error('PromotionReward id is required');

    if (props.type === 'Percentage') {
      if (props.value === undefined || props.value < 0 || props.value > 100) {
        throw new Error('Percentage discount must be between 0 and 100');
      }
    }

    if (props.type === 'FixedAmount') {
      if (props.value === undefined || props.value <= 0) {
        throw new Error('Fixed amount must be greater than zero');
      }
    }

    if (props.type === 'BuyXGetY') {
      if (props.buyQuantity === undefined || props.buyQuantity <= 0 || props.getQuantity === undefined || props.getQuantity <= 0) {
        throw new Error('BuyXGetY requires valid buy and reward quantities');
      }
    }

    return new PromotionReward(props);
  }
}
