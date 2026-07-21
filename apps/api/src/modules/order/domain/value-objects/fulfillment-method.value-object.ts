import { ValueObject } from '@saas/core';

export enum FulfillmentMethodEnum {
  DELIVERY = 'Delivery',
  PICKUP = 'Pickup',
  DINE_IN = 'Dine-In'
}

export interface FulfillmentMethodProps {
  value: FulfillmentMethodEnum;
}

export class FulfillmentMethod extends ValueObject<FulfillmentMethodProps> {
  private constructor(props: FulfillmentMethodProps) {
    super(props);
  }

  public static create(value: FulfillmentMethodEnum): FulfillmentMethod {
    if (!Object.values(FulfillmentMethodEnum).includes(value)) {
      throw new Error(`Unsupported fulfillment method: ${value}`);
    }
    return new FulfillmentMethod({ value });
  }

  get value(): FulfillmentMethodEnum {
    return this.props.value;
  }
}
