import { ValueObject } from '@saas/core';

export enum PaymentIntentOriginEnum {
  WEB = 'Web',
  IOS = 'iOS',
  ANDROID = 'Android',
  POS = 'POS',
  KIOSK = 'Kiosk',
  API = 'API'
}

export interface PaymentIntentOriginProps {
  value: PaymentIntentOriginEnum;
}

export class PaymentIntentOrigin extends ValueObject<PaymentIntentOriginProps> {
  private constructor(props: PaymentIntentOriginProps) {
    super(props);
  }

  public static create(value: PaymentIntentOriginEnum): PaymentIntentOrigin {
    if (!Object.values(PaymentIntentOriginEnum).includes(value)) {
      throw new Error(`Unsupported payment intent origin: ${value}`);
    }
    return new PaymentIntentOrigin({ value });
  }

  get value(): PaymentIntentOriginEnum {
    return this.props.value;
  }
}
