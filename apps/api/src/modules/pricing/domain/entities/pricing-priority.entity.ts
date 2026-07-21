import { Entity } from '@saas/core';
import { PricingRulePriority } from '../value-objects/pricing-rule-priority.value-object';

export interface PricingPriorityProps {
  priority: PricingRulePriority;
  weight: number;
  explicitOrder?: number;
  conflictResolutionStrategy: 'HIGHEST_DISCOUNT' | 'LOWEST_PRICE' | 'LATEST_CREATED' | 'STRICT_ORDER';
}

export class PricingPriority extends Entity<PricingPriorityProps> {
  private constructor(id: string, props: PricingPriorityProps) {
    super(id, props);
  }

  public static create(id: string, props: PricingPriorityProps): PricingPriority {
    if (props.weight < 0) {
      throw new Error('Weight cannot be negative');
    }
    return new PricingPriority(id, props);
  }

  get priority(): PricingRulePriority {
    return this.props.priority;
  }

  get weight(): number {
    return this.props.weight;
  }

  get explicitOrder(): number | undefined {
    return this.props.explicitOrder;
  }

  get conflictResolutionStrategy(): string {
    return this.props.conflictResolutionStrategy;
  }
}
