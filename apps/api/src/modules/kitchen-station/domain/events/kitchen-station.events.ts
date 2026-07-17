export class KitchenStationCreatedEvent {
  constructor(public readonly stationId: string, public readonly kitchenId: string) {}
}



export class KitchenStationActivatedEvent {
  constructor(public readonly stationId: string, public readonly kitchenId: string) {}
}

export class KitchenStationDeactivatedEvent {
  constructor(public readonly stationId: string, public readonly kitchenId: string) {}
}
