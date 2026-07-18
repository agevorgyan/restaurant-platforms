export interface SupplierContactDto {
  id?: string;
  name: string;
  position?: string;
  email?: string;
  phone?: string;
  isPrimary: boolean;
}

export interface SupplierAddressDto {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface CreateSupplierDto {
  restaurantId: string;
  supplierCode: string;
  name: string;
  legalName?: string;
  taxNumber?: string;
  email?: string;
  phone?: string;
  website?: string;
  type: string;
  paymentTerms?: string;
  address?: SupplierAddressDto;
  contacts?: SupplierContactDto[];
  notes?: string;
}

export interface UpdateSupplierDto {
  name?: string;
  legalName?: string;
  taxNumber?: string;
  email?: string;
  phone?: string;
  website?: string;
  type?: string;
  paymentTerms?: string;
  address?: SupplierAddressDto;
  notes?: string;
}
