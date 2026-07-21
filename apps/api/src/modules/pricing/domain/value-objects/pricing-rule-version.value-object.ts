import { ValueObject } from '@saas/core';

export interface PricingRuleVersionProps {
  value: number;
}

export class PricingRuleVersion extends ValueObject<PricingRuleVersionProps> {
  private constructor(props: PricingRuleVersionProps) {
    super(props);
  }

  public static create(value: number): PricingRuleVersion {
    if (!Number.isInteger(value)) {
      throw new Error('Version must be an integer');
    }
    if (value < 1) {
      throw new Error('Version must be at least 1');
    }
    return new PricingRuleVersion({ value });
  }

  public static initial(): PricingRuleVersion {
    return new PricingRuleVersion({ value: 1 });
  }

  public increment(): PricingRuleVersion {
    return new PricingRuleVersion({ value: this.props.value + 1 });
  }

  get value(): number {
    return this.props.value;
  }
}
