import { ValueObject } from '@saas/core';

export enum CheckoutOriginEnum {
  CUSTOMER_APP = 'CustomerApp',
  WEB_STOREFRONT = 'WebStorefront',
  KIOSK = 'Kiosk',
  POS = 'POS'
}

export interface CheckoutOriginProps {
  value: CheckoutOriginEnum;
}

export class CheckoutOrigin extends ValueObject<CheckoutOriginProps> {
  private constructor(props: CheckoutOriginProps) {
    super(props);
  }

  public static create(value: CheckoutOriginEnum): CheckoutOrigin {
    if (!Object.values(CheckoutOriginEnum).includes(value)) {
      throw new Error(`Invalid CheckoutOrigin: ${value}`);
    }
    return new CheckoutOrigin({ value });
  }

  get value(): CheckoutOriginEnum {
    return this.props.value;
  }
}
