import { IRestaurantMembership } from '../entities/restaurant-membership.interface';

export class RestaurantMembershipUpdatedEvent {
  constructor(public readonly membership: IRestaurantMembership) {}
}
