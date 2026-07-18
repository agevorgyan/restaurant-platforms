export class SupplierPriceListCreatedEvent {
  constructor(public readonly priceListId: string, public readonly restaurantId: string) {}
}

export class SupplierPriceListPublishedEvent {
  constructor(public readonly priceListId: string, public readonly restaurantId: string) {}
}

export class SupplierPriceUpdatedEvent {
  constructor(public readonly priceListId: string, public readonly ingredientId: string, public readonly restaurantId: string) {}
}
