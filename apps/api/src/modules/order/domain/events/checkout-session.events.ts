import { DomainEvent } from '@saas/core';

export class CheckoutSessionCreatedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();

  constructor(
    public readonly checkoutSessionId: string,
    public readonly orderQuotationId: string,
    public readonly pricingSnapshotId: string
  ) {}

  getAggregateId(): string {
    return this.checkoutSessionId;
  }
}

export class CheckoutActivatedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();

  constructor(
    public readonly checkoutSessionId: string
  ) {}

  getAggregateId(): string {
    return this.checkoutSessionId;
  }
}

export class CheckoutAwaitingPaymentEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();

  constructor(
    public readonly checkoutSessionId: string
  ) {}

  getAggregateId(): string {
    return this.checkoutSessionId;
  }
}

export class CheckoutPaymentAuthorizedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();

  constructor(
    public readonly checkoutSessionId: string
  ) {}

  getAggregateId(): string {
    return this.checkoutSessionId;
  }
}

export class CheckoutExpiredEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();

  constructor(
    public readonly checkoutSessionId: string
  ) {}

  getAggregateId(): string {
    return this.checkoutSessionId;
  }
}

export class CheckoutCancelledEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();

  constructor(
    public readonly checkoutSessionId: string,
    public readonly reason: string
  ) {}

  getAggregateId(): string {
    return this.checkoutSessionId;
  }
}

export class CheckoutCompletedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();

  constructor(
    public readonly checkoutSessionId: string,
    public readonly orderId: string
  ) {}

  getAggregateId(): string {
    return this.checkoutSessionId;
  }
}
