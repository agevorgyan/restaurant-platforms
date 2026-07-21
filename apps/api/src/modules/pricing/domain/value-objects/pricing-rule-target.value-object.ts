import { ValueObject } from '@saas/core';

export enum PricingRuleTargetEnum {
  ORDER = 'ORDER',
  ITEM = 'ITEM',
  CATEGORY = 'CATEGORY',
  DELIVERY_FEE = 'DELIVERY_FEE',
}

export interface PricingRuleTargetProps {
  value: PricingRuleTargetEnum;
}

export class PricingRuleTarget extends ValueObject<PricingRuleTargetProps> {
  private constructor(props: PricingRuleTargetProps) {
    super(props);
  }

  public static create(value: PricingRuleTargetEnum): PricingRuleTarget {
    if (!Object.values(PricingRuleTargetEnum).includes(value)) {
      throw new Error(`Invalid pricing rule target: ${value}`);
    }
    return new PricingRuleTarget({ value });
  }

  get value(): PricingRuleTargetEnum {
    return this.props.value;
  }
}
