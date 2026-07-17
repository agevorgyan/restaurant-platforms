export class KitchenOpenedEvent {
  constructor(public readonly kitchenId: string, public readonly branchId: string) {}
}

export class KitchenClosedEvent {
  constructor(public readonly kitchenId: string, public readonly branchId: string) {}
}

export class KitchenStatusChangedEvent {
  constructor(
    public readonly kitchenId: string,
    public readonly branchId: string,
    public readonly oldStatus: string,
    public readonly newStatus: string
  ) {}
}

export class KitchenCreatedEvent {
  constructor(public readonly kitchenId: string, public readonly branchId: string) {}
}
