import { MembershipRole } from '../value-objects/membership-role.value-object';
import { MembershipStatus } from '../value-objects/membership-status.value-object';

export interface IRestaurantMembership {
  id: string;
  restaurantId: string;
  userId: string;
  branchIds: string[];
  role: MembershipRole;
  status: MembershipStatus;
  joinedAt?: Date;
  invitedAt?: Date;
  lastActiveAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
