import { Entity } from '@saas/core';
import { PaymentIntentExpirationTime } from '../value-objects/payment-intent-expiration-time.value-object';

export interface PaymentIntentExpirationProps {
  expiresAt: PaymentIntentExpirationTime;
}

export class PaymentIntentExpiration extends Entity<PaymentIntentExpirationProps> {
  private constructor(props: PaymentIntentExpirationProps, id?: string) {
    super(id || crypto.randomUUID(), props);
  }

  public static create(props: PaymentIntentExpirationProps, id?: string): PaymentIntentExpiration {
    if (!props.expiresAt) {
      throw new Error('PaymentIntentExpiration must have a valid expiresAt time');
    }
    return new PaymentIntentExpiration(props, id);
  }

  public isExpired(now: Date = new Date()): boolean {
    return this.props.expiresAt.isExpired(now);
  }

  get expiresAt(): PaymentIntentExpirationTime {
    return this.props.expiresAt;
  }
}
