import { Entity } from '@saas/core';

export enum ChargeConditionType {
  ORDER_TOTAL = 'ORDER_TOTAL',
  DELIVERY_DISTANCE = 'DELIVERY_DISTANCE',
  WEIGHT = 'WEIGHT',
  QUANTITY = 'QUANTITY',
  CUSTOMER_TIER = 'CUSTOMER_TIER',
  TIME_WINDOW = 'TIME_WINDOW',
  DAY_OF_WEEK = 'DAY_OF_WEEK',
  RESTAURANT = 'RESTAURANT',
  BRANCH = 'BRANCH',
  SALES_CHANNEL = 'SALES_CHANNEL',
}

export interface ChargeConditionProps {
  type: ChargeConditionType;
  operator: 'EQUALS' | 'GREATER_THAN' | 'LESS_THAN' | 'BETWEEN' | 'IN';
  value: any;
}

export class ChargeCondition extends Entity<ChargeConditionProps> {
  private constructor(id: string, props: ChargeConditionProps) {
    super(id, props);
  }

  public static create(id: string, props: ChargeConditionProps): ChargeCondition {
    if (!Object.values(ChargeConditionType).includes(props.type)) {
      throw new Error(`Invalid condition type: ${props.type}`);
    }
    return new ChargeCondition(id, props);
  }

  get type(): ChargeConditionType {
    return this.props.type;
  }

  get operator(): string {
    return this.props.operator;
  }

  get value(): any {
    return this.props.value;
  }
}
