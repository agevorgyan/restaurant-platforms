import { Entity } from '@saas/core';
import { CustomerEmail } from '../value-objects/customer-email.value-object';
import { CustomerPhone } from '../value-objects/customer-phone.value-object';

export interface CustomerContactProps {
  email?: CustomerEmail;
  phone?: CustomerPhone;
  isVerified: boolean;
}

export class CustomerContact extends Entity<CustomerContactProps> {
  get email(): CustomerEmail | undefined { return this.props.email; }
  get phone(): CustomerPhone | undefined { return this.props.phone; }
  get isVerified(): boolean { return this.props.isVerified; }
  private constructor(id: string, props: CustomerContactProps) { super(id, props); }
  public static create(id: string, props: CustomerContactProps): CustomerContact {
    return new CustomerContact(id, props);
  }
}