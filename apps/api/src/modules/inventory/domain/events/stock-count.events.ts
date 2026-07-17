export class StockCountCreatedEvent {
  constructor(public readonly countId: string, public readonly restaurantId: string) {}
}

export class StockCountStartedEvent {
  constructor(public readonly countId: string, public readonly restaurantId: string) {}
}

export class StockCountCompletedEvent {
  constructor(public readonly countId: string, public readonly restaurantId: string) {}
}

export class StockCountApprovedEvent {
  constructor(public readonly countId: string, public readonly restaurantId: string) {}
}

export class StockCountCancelledEvent {
  constructor(public readonly countId: string, public readonly restaurantId: string) {}
}
