export class TicketQueuedEvent {
  constructor(public readonly queueId: string, public readonly ticketId: string) {}
}

export class TicketDequeuedEvent {
  constructor(public readonly queueId: string, public readonly ticketId: string) {}
}

export class TicketReorderedEvent {
  constructor(public readonly queueId: string, public readonly ticketId: string) {}
}

export class QueueCapacityReachedEvent {
  constructor(public readonly queueId: string, public readonly stationId: string) {}
}
