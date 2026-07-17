export class KitchenPreparationStartedEvent {
  constructor(public readonly workflowId: string, public readonly kitchenId: string) {}
}

export class KitchenPreparationPausedEvent {
  constructor(public readonly workflowId: string, public readonly kitchenId: string) {}
}

export class KitchenPreparationResumedEvent {
  constructor(public readonly workflowId: string, public readonly kitchenId: string) {}
}

export class KitchenPreparationCompletedEvent {
  constructor(public readonly workflowId: string, public readonly kitchenId: string) {}
}


