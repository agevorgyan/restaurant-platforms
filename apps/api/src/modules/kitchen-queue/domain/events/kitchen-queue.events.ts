export class KitchenQueueReorderedEvent {
  constructor(public readonly queueId: string, public readonly ticketId: string) {}
}
