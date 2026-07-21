import { Entity } from '@saas/core';
import { Money } from '../../../finance/domain/value-objects/money.value-object';

export interface PricingAdjustmentProps {
  description: string;
  amount: Money;
  type: 'DISCOUNT' | 'SURCHARGE';
  sourceId: string; // e.g. Rule ID, Coupon ID
}

export class PricingAdjustment extends Entity<PricingAdjustmentProps> {
  private constructor(id: string, props: PricingAdjustmentProps) {
    super(id, props);
  }

  public static create(id: string, props: PricingAdjustmentProps): PricingAdjustment {
    return new PricingAdjustment(id, props);
  }

  get description(): string { return this.props.description; }
  get amount(): Money { return this.props.amount; }
  get type(): 'DISCOUNT' | 'SURCHARGE' { return this.props.type; }
  get sourceId(): string { return this.props.sourceId; }
}
