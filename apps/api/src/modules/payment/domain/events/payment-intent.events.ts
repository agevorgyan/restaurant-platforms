import { DomainEvent } from '@saas/core';

export class PaymentIntentCreatedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();

  constructor(
    public readonly paymentIntentId: string,
    public readonly orderId: string,
    public readonly checkoutSessionId: string
  ) {}

  getAggregateId(): string {
    return this.paymentIntentId;
  }
}

export class PaymentIntentActivatedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();

  constructor(
    public readonly paymentIntentId: string
  ) {}

  getAggregateId(): string {
    return this.paymentIntentId;
  }
}

export class PaymentIntentAuthorizedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();

  constructor(
    public readonly paymentIntentId: string,
    public readonly transactionId: string
  ) {}

  getAggregateId(): string {
    return this.paymentIntentId;
  }
}

export class PaymentIntentExpiredEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();

  constructor(
    public readonly paymentIntentId: string
  ) {}

  getAggregateId(): string {
    return this.paymentIntentId;
  }
}

export class PaymentIntentCancelledEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();

  constructor(
    public readonly paymentIntentId: string,
    public readonly reason: string
  ) {}

  getAggregateId(): string {
    return this.paymentIntentId;
  }
}

export class PaymentIntentFailedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();

  constructor(
    public readonly paymentIntentId: string,
    public readonly reason: string
  ) {}

  getAggregateId(): string {
    return this.paymentIntentId;
  }
}
