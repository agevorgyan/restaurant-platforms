import { ValueObject } from '@saas/core';

export enum PaymentMethodEnum {
  CARD = 'Card',
  CASH = 'Cash',
  APPLE_PAY = 'ApplePay',
  GOOGLE_PAY = 'GooglePay',
  BANK_TRANSFER = 'BankTransfer',
  WALLET = 'Wallet',
  GIFT_CARD = 'GiftCard',
  LOYALTY_POINTS = 'LoyaltyPoints'
}

export interface PaymentMethodProps {
  value: PaymentMethodEnum;
}

export class PaymentMethod extends ValueObject<PaymentMethodProps> {
  private constructor(props: PaymentMethodProps) {
    super(props);
  }

  public static create(value: PaymentMethodEnum): PaymentMethod {
    if (!Object.values(PaymentMethodEnum).includes(value)) {
      throw new Error(`Unsupported payment method: ${value}`);
    }
    return new PaymentMethod({ value });
  }

  get value(): PaymentMethodEnum {
    return this.props.value;
  }
}
