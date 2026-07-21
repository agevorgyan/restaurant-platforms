import { ValueObject } from '@saas/core';

export interface PricingRulePriorityProps {
  value: number;
}

export class PricingRulePriority extends ValueObject<PricingRulePriorityProps> {
  private constructor(props: PricingRulePriorityProps) {
    super(props);
  }

  public static create(value: number): PricingRulePriority {
    if (!Number.isInteger(value)) {
      throw new Error('Priority must be an integer');
    }
    if (value < 0) {
      throw new Error('Priority cannot be negative');
    }
    return new PricingRulePriority({ value });
  }

  get value(): number {
    return this.props.value;
  }

  public isHigherThan(other: PricingRulePriority): boolean {
    return this.props.value > other.props.value;
  }
}
