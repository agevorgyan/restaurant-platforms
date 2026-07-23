import { ValueObject } from '@saas/core';

export interface ContactPhoneProps { phone: string; }

export class ContactPhone extends ValueObject<ContactPhoneProps> {
  get phone(): string { return this.props.phone; }
  private constructor(props: ContactPhoneProps) { super(props); }
  public static create(phone: string): ContactPhone {
    if (!phone) throw new Error('Valid phone format required');
    return new ContactPhone({ phone });
  }
}