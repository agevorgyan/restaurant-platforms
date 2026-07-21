import { ValueObject } from '@saas/core';

export enum PaymentProviderEnum {
  INTERNAL = 'Internal',
  STRIPE = 'Stripe',
  ADYEN = 'Adyen',
  PAYPAL = 'PayPal',
  AMERIABANK = 'AmeriaBank',
  IDRAM = 'IDram',
  TELCELL = 'Telcell',
  MOCK = 'Mock'
}

export interface PaymentProviderProps {
  value: PaymentProviderEnum;
}

export class PaymentProvider extends ValueObject<PaymentProviderProps> {
  private constructor(props: PaymentProviderProps) {
    super(props);
  }

  public static create(value: PaymentProviderEnum): PaymentProvider {
    if (!Object.values(PaymentProviderEnum).includes(value)) {
      throw new Error(`Unsupported payment provider: ${value}`);
    }
    return new PaymentProvider({ value });
  }

  get value(): PaymentProviderEnum {
    return this.props.value;
  }
}
