import { Entity } from '@saas/core';

export interface CheckoutContactProps {
  email: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
}

export class CheckoutContact extends Entity<CheckoutContactProps> {
  private constructor(id: string, props: CheckoutContactProps) {
    super(id, props);
  }

  public static create(props: CheckoutContactProps, id?: string): CheckoutContact {
    if (!props.email || props.email.trim().length === 0) {
      throw new Error('CheckoutContact must have an email address');
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(props.email)) {
      throw new Error('CheckoutContact email format is invalid');
    }

    return new CheckoutContact(id || crypto.randomUUID(), {
      email: props.email.trim(),
      phone: props.phone?.trim(),
      firstName: props.firstName?.trim(),
      lastName: props.lastName?.trim()
    });
  }

  get email(): string {
    return this.props.email;
  }

  get phone(): string | undefined {
    return this.props.phone;
  }
}
