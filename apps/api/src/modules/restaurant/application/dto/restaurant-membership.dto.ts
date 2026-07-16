export class CreateRestaurantMembershipDto {
  restaurantId: string;
  userId: string;
  role: string;
  branchIds?: string[];
}

export class UpdateRestaurantMembershipDto {
  role?: string;
  status?: string;
  branchIds?: string[];
}

export class RestaurantMembershipDto {
  id: string;
  restaurantId: string;
  userId: string;
  branchIds: string[];
  role: string;
  status: string;
  joinedAt?: Date;
  invitedAt?: Date;
  lastActiveAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
