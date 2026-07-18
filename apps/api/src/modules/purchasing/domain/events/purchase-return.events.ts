export class PurchaseReturnCreatedEvent {
  constructor(public readonly returnId: string, public readonly restaurantId: string) {}
}

export class PurchaseReturnAuthorizedEvent {
  constructor(public readonly returnId: string, public readonly restaurantId: string) {}
}

export class PurchaseReturnPostedEvent {
  constructor(public readonly returnId: string, public readonly restaurantId: string) {}
}

export class PurchaseReturnCancelledEvent {
  constructor(public readonly returnId: string, public readonly restaurantId: string) {}
}
