export class InventoryCreatedEvent {
  constructor(public readonly inventoryId: string, public readonly restaurantId: string) {}
}

export class InventoryUpdatedEvent {
  constructor(public readonly inventoryId: string, public readonly restaurantId: string) {}
}

export class InventoryActivatedEvent {
  constructor(public readonly inventoryId: string, public readonly restaurantId: string) {}
}

export class InventoryDeactivatedEvent {
  constructor(public readonly inventoryId: string, public readonly restaurantId: string) {}
}
