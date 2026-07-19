import { Entity } from '@saas/core';
import { PromotionCondition } from './promotion-condition.entity';

export interface PromotionRuleProps {
  id: string;
  name: string;
  conditions: PromotionCondition[];
}

export class PromotionRule extends Entity<PromotionRuleProps> {
  private constructor(props: PromotionRuleProps) {
    super(props.id, props);
  }

  public get id(): string { return this.props.id; }
  public get name(): string { return this.props.name; }
  public get conditions(): PromotionCondition[] { return [...this.props.conditions]; }

  public static create(props: PromotionRuleProps): PromotionRule {
    if (!props.id) throw new Error('PromotionRule id is required');
    if (!props.name || props.name.trim() === '') throw new Error('PromotionRule name cannot be empty');
    
    return new PromotionRule({
      ...props,
      conditions: props.conditions || []
    });
  }

  public addCondition(condition: PromotionCondition): void {
    this.props.conditions.push(condition);
  }

  public removeCondition(conditionId: string): void {
    this.props.conditions = this.props.conditions.filter(c => c.id !== conditionId);
  }
}
