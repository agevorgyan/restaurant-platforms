import { Entity } from '@saas/core';

export enum PricingActionType {
  INCREASE_PRICE = 'INCREASE_PRICE',
  REDUCE_PRICE = 'REDUCE_PRICE',
  REPLACE_PRICE = 'REPLACE_PRICE',
  LOCK_PRICE = 'LOCK_PRICE',
  IGNORE_RULE = 'IGNORE_RULE',
}

export interface PricingActionProps {
  type: PricingActionType;
  value: any; // Immutable value objects representing Money or Percentage
}

export class PricingAction extends Entity<PricingActionProps> {
  private constructor(id: string, props: PricingActionProps) {
    super(id, props);
  }

  public static create(id: string, props: PricingActionProps): PricingAction {
    if (!Object.values(PricingActionType).includes(props.type)) {
      throw new Error(`Invalid action type: ${props.type}`);
    }
    return new PricingAction(id, props);
  }

  get type(): PricingActionType {
    return this.props.type;
  }

  get value(): any {
    return this.props.value;
  }
}
