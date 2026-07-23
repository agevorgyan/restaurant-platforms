import { Entity } from '@saas/core';
import { ContactName } from '../value-objects/contact-name.value-object';
import { ContactPhone } from '../value-objects/contact-phone.value-object';

export interface CustomerEmergencyContactProps {
  name: ContactName;
  phone: ContactPhone;
}

export class CustomerEmergencyContact extends Entity<CustomerEmergencyContactProps> {
  private constructor(id: string, props: CustomerEmergencyContactProps) { super(id, props); }
  public static create(id: string, props: CustomerEmergencyContactProps): CustomerEmergencyContact {
    return new CustomerEmergencyContact(id, props);
  }
}