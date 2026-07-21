import { Entity } from '@saas/core';

export enum PricingConditionType {
  RESTAURANT = 'RESTAURANT',
  BRANCH = 'BRANCH',
  MENU = 'MENU',
  MENU_CATEGORY = 'MENU_CATEGORY',
  PRODUCT = 'PRODUCT',
  CUSTOMER_SEGMENT = 'CUSTOMER_SEGMENT',
  LOYALTY_TIER = 'LOYALTY_TIER',
  QUANTITY = 'QUANTITY',
  DATE_RANGE = 'DATE_RANGE',
  DAY_OF_WEEK = 'DAY_OF_WEEK',
  TIME_WINDOW = 'TIME_WINDOW',
  CURRENCY = 'CURRENCY',
  ORDER_CHANNEL = 'ORDER_CHANNEL',
}

export interface PricingConditionProps {
  type: PricingConditionType;
  operator: 'EQUALS' | 'NOT_EQUALS' | 'IN' | 'NOT_IN' | 'GREATER_THAN' | 'LESS_THAN' | 'BETWEEN';
  value: any; // Can be string, number, array of strings, etc. based on type
}

export class PricingCondition extends Entity<PricingConditionProps> {
  private constructor(id: string, props: PricingConditionProps) {
    super(id, props);
  }

  public static create(id: string, props: PricingConditionProps): PricingCondition {
    // Basic validation could be expanded based on type
    if (!Object.values(PricingConditionType).includes(props.type)) {
      throw new Error(`Invalid condition type: ${props.type}`);
    }
    return new PricingCondition(id, props);
  }

  get type(): PricingConditionType {
    return this.props.type;
  }

  get operator(): string {
    return this.props.operator;
  }

  get value(): any {
    return this.props.value;
  }
}
