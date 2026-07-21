import { DomainEvent } from '@saas/core';
import { OrderQuotationId } from '../value-objects/order-quotation-id.value-object';
import { QuotationNumber } from '../value-objects/quotation-number.value-object';

export class OrderQuotationCreated implements DomainEvent {
  public readonly dateTimeOccurred: Date;
  constructor(
    public readonly quotationId: OrderQuotationId,
    public readonly quotationNumber: QuotationNumber
  ) {
    this.dateTimeOccurred = new Date();
  }
  getAggregateId(): string { return this.quotationId.value; }
}

export class OrderQuotationCalculated implements DomainEvent {
  public readonly dateTimeOccurred: Date;
  constructor(public readonly quotationId: OrderQuotationId) {
    this.dateTimeOccurred = new Date();
  }
  getAggregateId(): string { return this.quotationId.value; }
}

export class OrderQuotationPublished implements DomainEvent {
  public readonly dateTimeOccurred: Date;
  constructor(public readonly quotationId: OrderQuotationId) {
    this.dateTimeOccurred = new Date();
  }
  getAggregateId(): string { return this.quotationId.value; }
}

export class OrderQuotationAccepted implements DomainEvent {
  public readonly dateTimeOccurred: Date;
  constructor(public readonly quotationId: OrderQuotationId) {
    this.dateTimeOccurred = new Date();
  }
  getAggregateId(): string { return this.quotationId.value; }
}

export class OrderQuotationRejected implements DomainEvent {
  public readonly dateTimeOccurred: Date;
  constructor(public readonly quotationId: OrderQuotationId) {
    this.dateTimeOccurred = new Date();
  }
  getAggregateId(): string { return this.quotationId.value; }
}

export class OrderQuotationExpired implements DomainEvent {
  public readonly dateTimeOccurred: Date;
  constructor(public readonly quotationId: OrderQuotationId) {
    this.dateTimeOccurred = new Date();
  }
  getAggregateId(): string { return this.quotationId.value; }
}

export class OrderQuotationSuperseded implements DomainEvent {
  public readonly dateTimeOccurred: Date;
  constructor(
    public readonly quotationId: OrderQuotationId,
    public readonly newQuotationId: OrderQuotationId
  ) {
    this.dateTimeOccurred = new Date();
  }
  getAggregateId(): string { return this.quotationId.value; }
}
