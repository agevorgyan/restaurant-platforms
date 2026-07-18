export interface ICustomerAddress {
  id: string;
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
