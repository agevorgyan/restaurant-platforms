import { ValueObject } from '@saas/core';

export interface PricingRuleNameProps {
  value: string;
}

export class PricingRuleName extends ValueObject<PricingRuleNameProps> {
  private constructor(props: PricingRuleNameProps) {
    super(props);
  }

  public static create(value: string): PricingRuleName {
    const trimmed = value.trim();
    if (trimmed.length < 3 || trimmed.length > 100) {
      throw new Error('PricingRuleName must be between 3 and 100 characters');
    }
    return new PricingRuleName({ value: trimmed });
  }

  get value(): string {
    return this.props.value;
  }
}
