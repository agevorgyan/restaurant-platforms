export class KitchenDisplayCreatedEvent {
  constructor(public readonly displayId: string, public readonly stationId: string) {}
}

export class KitchenDisplayUpdatedEvent {
  constructor(public readonly displayId: string) {}
}

export class KitchenDisplayActivatedEvent {
  constructor(public readonly displayId: string) {}
}

export class KitchenDisplayDeactivatedEvent {
  constructor(public readonly displayId: string) {}
}
