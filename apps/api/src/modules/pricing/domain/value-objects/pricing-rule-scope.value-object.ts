import { ValueObject } from '@saas/core';

export enum PricingRuleScopeEnum {
  GLOBAL = 'GLOBAL',
  RESTAURANT = 'RESTAURANT',
  BRANCH = 'BRANCH',
  CUSTOMER = 'CUSTOMER',
}

export interface PricingRuleScopeProps {
  value: PricingRuleScopeEnum;
}

export class PricingRuleScope extends ValueObject<PricingRuleScopeProps> {
  private constructor(props: PricingRuleScopeProps) {
    super(props);
  }

  public static create(value: PricingRuleScopeEnum): PricingRuleScope {
    if (!Object.values(PricingRuleScopeEnum).includes(value)) {
      throw new Error(`Invalid pricing rule scope: ${value}`);
    }
    return new PricingRuleScope({ value });
  }

  get value(): PricingRuleScopeEnum {
    return this.props.value;
  }
}
