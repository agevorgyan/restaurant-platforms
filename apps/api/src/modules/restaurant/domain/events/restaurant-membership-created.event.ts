import { IRestaurantMembership } from '../entities/restaurant-membership.interface';

export class RestaurantMembershipCreatedEvent {
  constructor(public readonly membership: IRestaurantMembership) {}
}
