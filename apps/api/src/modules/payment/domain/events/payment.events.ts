import { DomainEvent } from '@saas/core';
import { PaymentAmount } from '../value-objects/payment-amount.value-object';
import { PaymentFailureReason } from '../value-objects/payment-failure-reason.value-object';

export class PaymentCreatedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();

  constructor(
    public readonly paymentId: string,
    public readonly paymentIntentId: string,
    public readonly orderId: string,
    public readonly amount: PaymentAmount
  ) {}

  getAggregateId(): string {
    return this.paymentId;
  }
}

export class AuthorizationCreatedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();

  constructor(
    public readonly paymentId: string,
    public readonly authorizationId: string,
    public readonly reference: string,
    public readonly amount: PaymentAmount
  ) {}

  getAggregateId(): string {
    return this.paymentId;
  }
}

export class CaptureCreatedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();

  constructor(
    public readonly paymentId: string,
    public readonly captureId: string,
    public readonly reference: string,
    public readonly amount: PaymentAmount
  ) {}

  getAggregateId(): string {
    return this.paymentId;
  }
}

export class RefundCreatedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();

  constructor(
    public readonly paymentId: string,
    public readonly refundId: string,
    public readonly reference: string,
    public readonly amount: PaymentAmount,
    public readonly reason: string
  ) {}

  getAggregateId(): string {
    return this.paymentId;
  }
}

export class ChargebackCreatedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();

  constructor(
    public readonly paymentId: string,
    public readonly chargebackId: string,
    public readonly captureReference: string,
    public readonly amount: PaymentAmount,
    public readonly reason: string
  ) {}

  getAggregateId(): string {
    return this.paymentId;
  }
}

export class PaymentCompletedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();

  constructor(
    public readonly paymentId: string
  ) {}

  getAggregateId(): string {
    return this.paymentId;
  }
}

export class PaymentFailedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();

  constructor(
    public readonly paymentId: string,
    public readonly reason: PaymentFailureReason
  ) {}

  getAggregateId(): string {
    return this.paymentId;
  }
}

export class PaymentCancelledEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();

  constructor(
    public readonly paymentId: string,
    public readonly reason: string
  ) {}

  getAggregateId(): string {
    return this.paymentId;
  }
}
