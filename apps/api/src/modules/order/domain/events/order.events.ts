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

export class OrderStatusChangedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();

  constructor(
    public readonly orderId: string,
    public readonly restaurantId: string,
    public readonly fromStatus: string,
    public readonly toStatus: string
  ) {}

  getAggregateId(): string {
    return this.orderId;
  }
}

export class OrderPreparedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();

  constructor(
    public readonly orderId: string,
    public readonly restaurantId: string
  ) {}

  getAggregateId(): string {
    return this.orderId;
  }
}

export class OrderReadyEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();

  constructor(
    public readonly orderId: string,
    public readonly restaurantId: string
  ) {}

  getAggregateId(): string {
    return this.orderId;
  }
}

export class OrderDispatchedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();

  constructor(
    public readonly orderId: string,
    public readonly restaurantId: string
  ) {}

  getAggregateId(): string {
    return this.orderId;
  }
}

export class OrderDeliveredEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();

  constructor(
    public readonly orderId: string,
    public readonly restaurantId: string
  ) {}

  getAggregateId(): string {
    return this.orderId;
  }
}

export class OrderCompletedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();

  constructor(
    public readonly orderId: string,
    public readonly restaurantId: string
  ) {}

  getAggregateId(): string {
    return this.orderId;
  }
}

export class OrderRejectedEvent implements DomainEvent {
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
