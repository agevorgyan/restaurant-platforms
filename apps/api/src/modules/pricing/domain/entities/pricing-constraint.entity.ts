import { Entity } from '@saas/core';

export enum PricingConstraintType {
  NON_COMBINABLE = 'NON_COMBINABLE',
  MAX_DISCOUNT_AMOUNT = 'MAX_DISCOUNT_AMOUNT',
  MIN_ORDER_AMOUNT = 'MIN_ORDER_AMOUNT',
  USAGE_LIMIT = 'USAGE_LIMIT',
}

export interface PricingConstraintProps {
  type: PricingConstraintType;
  value?: any; // The threshold or limit definition
}

export class PricingConstraint extends Entity<PricingConstraintProps> {
  private constructor(id: string, props: PricingConstraintProps) {
    super(id, props);
  }

  public static create(id: string, props: PricingConstraintProps): PricingConstraint {
    if (!Object.values(PricingConstraintType).includes(props.type)) {
      throw new Error(`Invalid constraint type: ${props.type}`);
    }
    return new PricingConstraint(id, props);
  }

  get type(): PricingConstraintType {
    return this.props.type;
  }

  get value(): any {
    return this.props.value;
  }
}
