export class RestaurantMembershipRemovedEvent {
  constructor(public readonly membershipId: string, public readonly restaurantId: string) {}
}
