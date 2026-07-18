export interface ICustomerContact {
  id: string;
  name: string;
  role?: string;
  phone?: string;
  email?: string;
  isPrimary: boolean;
}
