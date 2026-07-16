export class RestaurantUpdatedEvent {
  constructor(
    public readonly restaurantId: string,
    public readonly timestamp: Date = new Date(),
  ) {}
}
