import { Address, WorkingHours } from '../value-objects';

export interface IBranch {
  id: string;
  restaurantId: string;
  name: string;
  address: Address;
  workingHours: WorkingHours[];
  phoneNumber?: string;
  email?: string;
  timezone: string;
  isMainBranch: boolean;
  status: 'active' | 'inactive' | 'temporarily_closed';
  createdAt: Date;
  updatedAt: Date;
}
