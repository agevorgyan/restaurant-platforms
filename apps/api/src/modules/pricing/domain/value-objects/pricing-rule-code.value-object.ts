import { ValueObject } from '@saas/core';

export interface PricingRuleCodeProps {
  value: string;
}

export class PricingRuleCode extends ValueObject<PricingRuleCodeProps> {
  private constructor(props: PricingRuleCodeProps) {
    super(props);
  }

  public static create(value: string): PricingRuleCode {
    const sanitized = value.trim().toUpperCase();
    if (!/^[A-Z0-9_-]{3,50}$/.test(sanitized)) {
      throw new Error('PricingRuleCode must be 3-50 characters long and contain only uppercase letters, numbers, hyphens, or underscores');
    }
    return new PricingRuleCode({ value: sanitized });
  }

  get value(): string {
    return this.props.value;
  }
}
