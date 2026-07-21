import { Entity } from '@saas/core';

export enum ChargeTargetType {
  ENTIRE_ORDER = 'ENTIRE_ORDER',
  DELIVERY = 'DELIVERY',
  PICKUP = 'PICKUP',
  DINE_IN = 'DINE_IN',
  PRODUCT = 'PRODUCT',
  CATEGORY = 'CATEGORY',
  RESTAURANT = 'RESTAURANT',
  BRANCH = 'BRANCH',
}

export interface ChargeTargetProps {
  type: ChargeTargetType;
  value?: string; // Optional ID if target requires specificity (e.g., PRODUCT ID)
}

export class ChargeTarget extends Entity<ChargeTargetProps> {
  private constructor(id: string, props: ChargeTargetProps) {
    super(id, props);
  }

  public static create(id: string, props: ChargeTargetProps): ChargeTarget {
    if (!Object.values(ChargeTargetType).includes(props.type)) {
      throw new Error(`Invalid charge target type: ${props.type}`);
    }
    return new ChargeTarget(id, props);
  }

  get type(): ChargeTargetType {
    return this.props.type;
  }

  get value(): string | undefined {
    return this.props.value;
  }
}
