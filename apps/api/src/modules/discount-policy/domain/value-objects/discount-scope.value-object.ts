import { ValueObject } from '@saas/core';

export enum DiscountScopeEnum {
  ORDER = 'Order',
  PRODUCT = 'Product',
  CATEGORY = 'Category',
  DELIVERY = 'Delivery',
}

export interface DiscountScopeProps {
  value: DiscountScopeEnum;
}

export class DiscountScope extends ValueObject<DiscountScopeProps> {
  private constructor(props: DiscountScopeProps) {
    super(props);
  }

  public static create(value: DiscountScopeEnum): DiscountScope {
    return new DiscountScope({ value });
  }

  get value(): DiscountScopeEnum {
    return this.props.value;
  }
}
