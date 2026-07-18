export class PurchaseOrderCreatedEvent {
  constructor(public readonly orderId: string, public readonly restaurantId: string) {}
}

export class PurchaseOrderSubmittedEvent {
  constructor(public readonly orderId: string, public readonly restaurantId: string) {}
}

export class PurchaseOrderApprovedEvent {
  constructor(public readonly orderId: string, public readonly restaurantId: string) {}
}

export class PurchaseOrderRejectedEvent {
  constructor(public readonly orderId: string, public readonly restaurantId: string) {}
}

export class PurchaseOrderCancelledEvent {
  constructor(public readonly orderId: string, public readonly restaurantId: string) {}
}

export class PurchaseOrderPartiallyReceivedEvent {
  constructor(public readonly orderId: string, public readonly restaurantId: string) {}
}

export class PurchaseOrderCompletedEvent {
  constructor(public readonly orderId: string, public readonly restaurantId: string) {}
}
