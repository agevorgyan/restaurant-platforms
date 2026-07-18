import { SupplierStatus } from '../value-objects/supplier-status.value-object';
import { SupplierType } from '../value-objects/supplier-type.value-object';
import { SupplierCode } from '../value-objects/supplier-code.value-object';
import { SupplierAddress } from '../value-objects/supplier-address.value-object';
import { SupplierPaymentTerms } from '../value-objects/supplier-payment-terms.value-object';
import { ISupplierContact } from './supplier-contact.interface';
import { IDomainEvent } from '../events/domain-event.interface';

export interface ISupplier {
  id: string;
  restaurantId: string;
  supplierCode: SupplierCode;
  name: string;
  legalName?: string;
  taxNumber?: string;
  email?: string;
  phone?: string;
  website?: string;
  status: SupplierStatus;
  type: SupplierType;
  paymentTerms?: SupplierPaymentTerms;
  address?: SupplierAddress;
  contacts: ISupplierContact[];
  notes?: string;
  domainEvents?: IDomainEvent[];
  createdAt: Date;
  updatedAt: Date;
}
