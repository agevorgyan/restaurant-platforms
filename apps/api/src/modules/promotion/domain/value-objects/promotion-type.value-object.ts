import { ValueObject } from '@saas/core';

export type PromotionTypeEnum = 'Percentage' | 'FixedAmount' | 'BuyXGetY' | 'FreeItem' | 'FreeDelivery';

interface PromotionTypeProps {
  value: PromotionTypeEnum;
}

export class PromotionType extends ValueObject<PromotionTypeProps> {
  private constructor(props: PromotionTypeProps) {
    super(props);
  }

  public get value(): PromotionTypeEnum {
    return this.props.value;
  }

  public static create(type: string): PromotionType {
    const valid: PromotionTypeEnum[] = ['Percentage', 'FixedAmount', 'BuyXGetY', 'FreeItem', 'FreeDelivery'];
    if (!valid.includes(type as PromotionTypeEnum)) {
      throw new Error(`Invalid Promotion Type: ${type}`);
    }
    return new PromotionType({ value: type as PromotionTypeEnum });
  }
}
