import { Entity } from '@saas/core';
import { DiscountCondition } from './discount-condition.entity';
import { DiscountBenefit } from './discount-benefit.entity';

export interface DiscountRuleProps {
  name: string;
  condition: DiscountCondition;
  benefit: DiscountBenefit;
}

export class DiscountRule extends Entity<DiscountRuleProps> {
  private constructor(id: string, props: DiscountRuleProps) {
    super(id, props);
  }

  public static create(id: string, name: string, condition: DiscountCondition, benefit: DiscountBenefit): DiscountRule {
    if (!name || name.trim().length === 0) {
      throw new Error('Discount rule name cannot be empty');
    }
    return new DiscountRule(id, { name, condition, benefit });
  }

  get name(): string { return this.props.name; }
  get condition(): DiscountCondition { return this.props.condition; }
  get benefit(): DiscountBenefit { return this.props.benefit; }

  public isSatisfiedBy(context: any): boolean {
    return this.props.condition.isSatisfiedBy(context);
  }
}
