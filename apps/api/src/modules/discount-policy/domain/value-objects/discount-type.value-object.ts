import { ValueObject } from '@saas/core';

export enum DiscountTypeEnum {
  PERCENTAGE = 'Percentage',
  FIXED_AMOUNT = 'FixedAmount',
  BUY_X_GET_Y = 'BuyXGetY',
  CHEAPEST_ITEM = 'CheapestItem',
  HIGHEST_PRICE = 'HighestPrice',
  FREE_PRODUCT = 'FreeProduct',
  FREE_DELIVERY = 'FreeDelivery',
  BUNDLE = 'Bundle',
}

export interface DiscountTypeProps {
  value: DiscountTypeEnum;
}

export class DiscountType extends ValueObject<DiscountTypeProps> {
  private constructor(props: DiscountTypeProps) {
    super(props);
  }

  public static create(value: DiscountTypeEnum): DiscountType {
    return new DiscountType({ value });
  }

  get value(): DiscountTypeEnum {
    return this.props.value;
  }
}
