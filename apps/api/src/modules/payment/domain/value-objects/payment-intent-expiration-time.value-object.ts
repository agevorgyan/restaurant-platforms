import { ValueObject } from '@saas/core';

export interface PaymentIntentExpirationTimeProps {
  value: Date;
}

export class PaymentIntentExpirationTime extends ValueObject<PaymentIntentExpirationTimeProps> {
  private constructor(props: PaymentIntentExpirationTimeProps) {
    super(props);
  }

  public static create(value: Date): PaymentIntentExpirationTime {
    if (!(value instanceof Date) || isNaN(value.getTime())) {
      throw new Error('PaymentIntentExpirationTime must be a valid Date object');
    }
    return new PaymentIntentExpirationTime({ value });
  }

  public isExpired(now: Date = new Date()): boolean {
    return this.props.value.getTime() <= now.getTime();
  }

  get value(): Date {
    return this.props.value;
  }
}
