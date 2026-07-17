export class KitchenDisplayActivatedEvent {
  constructor(public readonly displayId: string) {}
}

export class KitchenDisplayDeactivatedEvent {
  constructor(public readonly displayId: string) {}
}
