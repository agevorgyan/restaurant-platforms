import { ValueObject } from '@saas/core';

export interface CheckoutExpirationTimeProps {
  value: Date;
}

export class CheckoutExpirationTime extends ValueObject<CheckoutExpirationTimeProps> {
  private constructor(props: CheckoutExpirationTimeProps) {
    super(props);
  }

  public static create(value: Date): CheckoutExpirationTime {
    if (!(value instanceof Date) || isNaN(value.getTime())) {
      throw new Error('CheckoutExpirationTime must be a valid Date object');
    }
    return new CheckoutExpirationTime({ value });
  }

  public static fromNow(minutes: number): CheckoutExpirationTime {
    if (minutes <= 0) {
      throw new Error('Expiration minutes must be positive');
    }
    const d = new Date();
    d.setMinutes(d.getMinutes() + minutes);
    return new CheckoutExpirationTime({ value: d });
  }

  public isExpired(referenceDate: Date = new Date()): boolean {
    return referenceDate > this.props.value;
  }

  get value(): Date {
    return this.props.value;
  }
}
