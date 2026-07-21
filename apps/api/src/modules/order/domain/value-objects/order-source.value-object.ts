import { ValueObject } from '@saas/core';

export enum OrderSourceEnum {
  CUSTOMER_APP = 'Customer App',
  QR_MENU = 'QR Menu',
  POS = 'POS',
  CALL_CENTER = 'Call Center',
  WEBSITE = 'Website',
  THIRD_PARTY_MARKETPLACE = 'Third Party Marketplace',
  INTERNAL_ADMIN = 'Internal Admin'
}

export interface OrderSourceProps {
  value: OrderSourceEnum;
}

export class OrderSource extends ValueObject<OrderSourceProps> {
  private constructor(props: OrderSourceProps) {
    super(props);
  }

  public static create(value: OrderSourceEnum): OrderSource {
    if (!Object.values(OrderSourceEnum).includes(value)) {
      throw new Error(`Unsupported order source: ${value}`);
    }
    return new OrderSource({ value });
  }

  get value(): OrderSourceEnum {
    return this.props.value;
  }
}
