import { ICustomerAddress } from './customer-address.interface';
import { ICustomerContact } from './customer-contact.interface';
import { ICustomerPreference } from './customer-preference.interface';
import { ICustomerTag } from './customer-tag.interface';
import { CustomerStatus } from '../value-objects/customer-status.value-object';
import { CustomerType } from '../value-objects/customer-type.value-object';
import { CustomerCode } from '../value-objects/customer-code.value-object';
import { IDomainEvent } from '../events/domain-event.interface';

export interface ICustomer {
  id: string;
  restaurantId: string;
  customerCode: CustomerCode;
  firstName?: string;
  lastName?: string;
  companyName?: string;
  customerType: CustomerType;
  status: CustomerStatus;
  email?: string;
  phone?: string;
  dateOfBirth?: Date;
  addresses: ICustomerAddress[];
  contacts: ICustomerContact[];
  preferences: ICustomerPreference;
  tags: ICustomerTag[];
  notes?: string;
  domainEvents?: IDomainEvent[];
  createdAt: Date;
  updatedAt: Date;
}
