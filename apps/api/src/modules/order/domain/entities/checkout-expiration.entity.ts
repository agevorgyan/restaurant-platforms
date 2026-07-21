import { Entity } from '@saas/core';
import { CheckoutExpirationTime } from '../value-objects/checkout-expiration-time.value-object';

export interface CheckoutExpirationProps {
  createdAt: CheckoutExpirationTime;
  expiresAt: CheckoutExpirationTime;
}

export class CheckoutExpiration extends Entity<CheckoutExpirationProps> {
  private constructor(id: string, props: CheckoutExpirationProps) {
    super(id, props);
  }

  public static create(props: CheckoutExpirationProps, id?: string): CheckoutExpiration {
    if (props.createdAt.value >= props.expiresAt.value) {
      throw new Error('Checkout expiration time must be strictly after creation time');
    }

    return new CheckoutExpiration(id || crypto.randomUUID(), props);
  }

  public static withDefaultTimeout(timeoutMinutes: number = 15, id?: string): CheckoutExpiration {
    const createdAt = CheckoutExpirationTime.create(new Date());
    const expiresAt = CheckoutExpirationTime.fromNow(timeoutMinutes);
    return new CheckoutExpiration(id || crypto.randomUUID(), { createdAt, expiresAt });
  }

  public isExpired(referenceDate: Date = new Date()): boolean {
    return this.props.expiresAt.isExpired(referenceDate);
  }

  get createdAt(): CheckoutExpirationTime {
    return this.props.createdAt;
  }

  get expiresAt(): CheckoutExpirationTime {
    return this.props.expiresAt;
  }
}
