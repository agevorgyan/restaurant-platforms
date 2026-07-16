import { Address } from '../value-objects';

export interface IBranch {
  id: string;
  restaurantId: string;
  name: string;
  address: Address;
  phoneNumber?: string;
  email?: string;
  isMainBranch: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
