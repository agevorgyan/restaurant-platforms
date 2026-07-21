import { ValueObject } from '@saas/core';

export interface PricingRuleIdProps {
  value: string;
}

export class PricingRuleId extends ValueObject<PricingRuleIdProps> {
  private constructor(props: PricingRuleIdProps) {
    super(props);
  }

  public static create(value: string): PricingRuleId {
    if (!value || value.trim().length === 0) {
      throw new Error('PricingRuleId cannot be empty');
    }
    return new PricingRuleId({ value });
  }

  get value(): string {
    return this.props.value;
  }
}
