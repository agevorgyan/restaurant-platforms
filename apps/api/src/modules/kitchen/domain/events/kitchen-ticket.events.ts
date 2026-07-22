import { DomainEvent } from '@saas/core';

export class KitchenTicketCreatedEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date = new Date();

  constructor(
    public readonly ticketId: string,
    public readonly orderId: string,
    public readonly ticketNumber: string
  ) {}

  public getAggregateId(): string {
    return this.ticketId;
  }
}

export class KitchenTicketQueuedEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date = new Date();

  constructor(public readonly ticketId: string) {}

  public getAggregateId(): string {
    return this.ticketId;
  }
}

export class KitchenPreparationStartedEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date = new Date();

  constructor(public readonly ticketId: string) {}

  public getAggregateId(): string {
    return this.ticketId;
  }
}

export class KitchenPreparationPausedEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date = new Date();

  constructor(public readonly ticketId: string) {}

  public getAggregateId(): string {
    return this.ticketId;
  }
}

export class KitchenPreparationResumedEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date = new Date();

  constructor(public readonly ticketId: string) {}

  public getAggregateId(): string {
    return this.ticketId;
  }
}

export class KitchenTicketReadyEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date = new Date();

  constructor(public readonly ticketId: string) {}

  public getAggregateId(): string {
    return this.ticketId;
  }
}

export class KitchenTicketServedEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date = new Date();

  constructor(public readonly ticketId: string) {}

  public getAggregateId(): string {
    return this.ticketId;
  }
}

export class KitchenTicketCancelledEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date = new Date();

  constructor(
    public readonly ticketId: string,
    public readonly reason: string
  ) {}

  public getAggregateId(): string {
    return this.ticketId;
  }
}

export class KitchenPriorityChangedEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date = new Date();

  constructor(
    public readonly ticketId: string,
    public readonly previousPriority: string,
    public readonly newPriority: string
  ) {}

  public getAggregateId(): string {
    return this.ticketId;
  }
}
