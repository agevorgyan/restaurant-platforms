export class SupplierCreatedEvent {
  constructor(public readonly supplierId: string, public readonly restaurantId: string) {}
}

export class SupplierUpdatedEvent {
  constructor(public readonly supplierId: string, public readonly restaurantId: string) {}
}

export class SupplierActivatedEvent {
  constructor(public readonly supplierId: string, public readonly restaurantId: string) {}
}

export class SupplierDeactivatedEvent {
  constructor(public readonly supplierId: string, public readonly restaurantId: string) {}
}

export class SupplierArchivedEvent {
  constructor(public readonly supplierId: string, public readonly restaurantId: string) {}
}
