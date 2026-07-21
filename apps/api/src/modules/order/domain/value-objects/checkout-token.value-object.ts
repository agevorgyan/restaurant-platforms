import { ValueObject } from '@saas/core';
import * as crypto from 'crypto';

export interface CheckoutTokenProps {
  value: string;
}

export class CheckoutToken extends ValueObject<CheckoutTokenProps> {
  private constructor(props: CheckoutTokenProps) {
    super(props);
  }

  public static create(value?: string): CheckoutToken {
    if (value) {
      if (value.length < 16) {
        throw new Error('CheckoutToken must be at least 16 characters if provided');
      }
      return new CheckoutToken({ value });
    }

    return new CheckoutToken({
      value: crypto.randomBytes(32).toString('hex')
    });
  }

  get value(): string {
    return this.props.value;
  }
}
