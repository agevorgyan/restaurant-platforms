import { Address, WorkingHours } from '../value-objects';

export interface IBranch {
  id: string;
  restaurantId: string;
  name: string;
  code: string;
  status: 'active' | 'inactive' | 'temporarily_closed';
  address?: Address;
  workingHours?: WorkingHours;
  phone?: string;
  email?: string;
  timezone: string;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
}
