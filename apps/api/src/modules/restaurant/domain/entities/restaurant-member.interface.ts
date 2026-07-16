export interface IRestaurantMember {
  id: string;
  restaurantId: string;
  userId: string; // Links back to Identity domain User
  role: 'owner' | 'manager' | 'staff' | 'chef';
  joinedAt: Date;
  isActive: boolean;
}
