export class InventoryAdjustmentCreatedEvent {
  constructor(public readonly adjustmentId: string, public readonly restaurantId: string) {}
}

export class InventoryAdjustmentApprovedEvent {
  constructor(public readonly adjustmentId: string, public readonly restaurantId: string) {}
}

export class InventoryAdjustmentRejectedEvent {
  constructor(public readonly adjustmentId: string, public readonly restaurantId: string) {}
}

export class InventoryAdjustmentPostedEvent {
  constructor(public readonly adjustmentId: string, public readonly restaurantId: string) {}
}

export class InventoryAdjustmentCancelledEvent {
  constructor(public readonly adjustmentId: string, public readonly restaurantId: string) {}
}
