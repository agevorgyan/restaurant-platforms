import { ValueObject } from '@saas/core';

export enum PricingRuleTypeEnum {
  FIXED_PRICE = 'FIXED_PRICE',
  PERCENTAGE_ADJUSTMENT = 'PERCENTAGE_ADJUSTMENT',
  FIXED_AMOUNT_ADJUSTMENT = 'FIXED_AMOUNT_ADJUSTMENT',
  OVERRIDE_PRICE = 'OVERRIDE_PRICE',
  HAPPY_HOUR = 'HAPPY_HOUR',
  TIME_BASED = 'TIME_BASED',
  CUSTOMER_TIER = 'CUSTOMER_TIER',
  RESTAURANT_SPECIFIC = 'RESTAURANT_SPECIFIC',
  BRANCH_SPECIFIC = 'BRANCH_SPECIFIC',
  MENU_CATEGORY = 'MENU_CATEGORY',
  PRODUCT_SPECIFIC = 'PRODUCT_SPECIFIC',
  QUANTITY_BREAK = 'QUANTITY_BREAK',
}

export interface PricingRuleTypeProps {
  value: PricingRuleTypeEnum;
}

export class PricingRuleType extends ValueObject<PricingRuleTypeProps> {
  private constructor(props: PricingRuleTypeProps) {
    super(props);
  }

  public static create(value: PricingRuleTypeEnum): PricingRuleType {
    if (!Object.values(PricingRuleTypeEnum).includes(value)) {
      throw new Error(`Invalid pricing rule type: ${value}`);
    }
    return new PricingRuleType({ value });
  }

  get value(): PricingRuleTypeEnum {
    return this.props.value;
  }
}
