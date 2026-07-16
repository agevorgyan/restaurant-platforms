export class RestaurantCreatedEvent {
  constructor(
    public readonly restaurantId: string,
    public readonly organizationId: string,
    public readonly name: string,
    public readonly timestamp: Date = new Date(),
  ) {}
}
