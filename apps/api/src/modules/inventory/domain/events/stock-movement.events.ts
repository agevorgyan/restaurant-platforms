export class StockMovementCreatedEvent {
  constructor(public readonly movementId: string, public readonly restaurantId: string) {}
}

export class StockMovementPostedEvent {
  constructor(public readonly movementId: string, public readonly restaurantId: string) {}
}

export class StockMovementCancelledEvent {
  constructor(public readonly movementId: string, public readonly restaurantId: string) {}
}
