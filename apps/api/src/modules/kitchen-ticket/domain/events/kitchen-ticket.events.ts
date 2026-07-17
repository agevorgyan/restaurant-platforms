export class KitchenTicketCreatedEvent {
  constructor(public readonly ticketId: string, public readonly kitchenId: string) {}
}

export class KitchenTicketStartedEvent {
  constructor(public readonly ticketId: string, public readonly kitchenId: string) {}
}

export class KitchenTicketReadyEvent {
  constructor(public readonly ticketId: string, public readonly kitchenId: string) {}
}

export class KitchenTicketCompletedEvent {
  constructor(public readonly ticketId: string, public readonly kitchenId: string) {}
}

export class KitchenTicketCancelledEvent {
  constructor(public readonly ticketId: string, public readonly kitchenId: string) {}
}
