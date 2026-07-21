import { DomainEvent } from '@saas/core';

export class OrderCreatedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();

  constructor(
    public readonly orderId: string,
    public readonly restaurantId: string,
    public readonly branchId: string
  ) {}

  getAggregateId(): string {
    return this.orderId;
  }
}

export class OrderConfirmedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();

  constructor(
    public readonly orderId: string,
    public readonly restaurantId: string
  ) {}

  getAggregateId(): string {
    return this.orderId;
  }
}

export class OrderCancelledEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();

  constructor(
    public readonly orderId: string,
    public readonly restaurantId: string,
    public readonly reason: string
  ) {}

  getAggregateId(): string {
    return this.orderId;
  }
}

export class OrderDeliveryAddressUpdatedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();

  constructor(
    public readonly orderId: string,
    public readonly restaurantId: string
  ) {}

  getAggregateId(): string {
    return this.orderId;
  }
}
