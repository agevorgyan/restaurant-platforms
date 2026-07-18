export interface CustomerAddressDto {
  label: string;
  country: string;
  city: string;
  street: string;
  building?: string;
  apartment?: string;
  postalCode: string;
  latitude?: number;
  longitude?: number;
  isDefault: boolean;
}

export interface CustomerContactDto {
  name: string;
  role?: string;
  phone?: string;
  email?: string;
  isPrimary: boolean;
}

export interface CustomerPreferenceDto {
  favoriteLanguage?: string;
  marketingConsent: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
}

export interface CustomerTagDto {
  name: string;
  color?: string;
}

export interface CreateCustomerDto {
  restaurantId: string;
  customerCode: string;
  firstName?: string;
  lastName?: string;
  companyName?: string;
  customerType: string;
  email?: string;
  phone?: string;
  dateOfBirth?: Date;
  addresses?: CustomerAddressDto[];
  contacts?: CustomerContactDto[];
  preferences?: CustomerPreferenceDto;
  tags?: CustomerTagDto[];
  notes?: string;
}

export interface UpdateCustomerDto {
  firstName?: string;
  lastName?: string;
  companyName?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: Date;
  addresses?: CustomerAddressDto[];
  contacts?: CustomerContactDto[];
  preferences?: CustomerPreferenceDto;
  tags?: CustomerTagDto[];
  notes?: string;
}
