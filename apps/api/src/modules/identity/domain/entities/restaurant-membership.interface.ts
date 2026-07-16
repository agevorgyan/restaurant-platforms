export interface IRestaurantMembership {
  id: string;
  userId: string;
  organizationId: string;
  roleId: string;
  joinedAt: Date;
  isActive: boolean;
}
