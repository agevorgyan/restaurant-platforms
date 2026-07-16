import { IRestaurantMembership } from '../entities/restaurant-membership.interface';

export interface IRestaurantMembershipRepository {
  create(membership: IRestaurantMembership): Promise<IRestaurantMembership>;
  findById(id: string): Promise<IRestaurantMembership | null>;
  findByRestaurantId(restaurantId: string): Promise<IRestaurantMembership[]>;
  findByUserId(userId: string): Promise<IRestaurantMembership[]>;
  update(id: string, membership: Partial<IRestaurantMembership>): Promise<IRestaurantMembership>;
  remove(id: string): Promise<void>;
  countOwnersByRestaurantId(restaurantId: string): Promise<number>;
}
