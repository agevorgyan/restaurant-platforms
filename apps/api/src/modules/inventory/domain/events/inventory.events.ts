import { DomainEvent } from '@saas/core';

export class InventoryCreatedEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date;

  constructor(
    public readonly aggregateId: string,
    public readonly restaurantId: string,
    public readonly ingredientId: string,
    public readonly locationId: string
  ) {
    this.dateTimeOccurred = new Date();
  }

  public getAggregateId(): string {
    return this.aggregateId;
  }
}

export class StockReservedEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date;

  constructor(
    public readonly aggregateId: string,
    public readonly restaurantId: string,
    public readonly reservationId: string,
    public readonly quantity: number,
    public readonly availableQuantity: number
  ) {
    this.dateTimeOccurred = new Date();
  }

  public getAggregateId(): string {
    return this.aggregateId;
  }
}

export class ReservationReleasedEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date;

  constructor(
    public readonly aggregateId: string,
    public readonly restaurantId: string,
    public readonly reservationId: string,
    public readonly availableQuantity: number
  ) {
    this.dateTimeOccurred = new Date();
  }

  public getAggregateId(): string {
    return this.aggregateId;
  }
}

export class InventoryAdjustedEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date;

  constructor(
    public readonly aggregateId: string,
    public readonly restaurantId: string,
    public readonly onHandQuantity: number,
    public readonly availableQuantity: number
  ) {
    this.dateTimeOccurred = new Date();
  }

  public getAggregateId(): string {
    return this.aggregateId;
  }
}

export class InventoryLowStockEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date;

  constructor(
    public readonly aggregateId: string,
    public readonly restaurantId: string,
    public readonly currentQuantity: number,
    public readonly reorderLevel: number
  ) {
    this.dateTimeOccurred = new Date();
  }

  public getAggregateId(): string {
    return this.aggregateId;
  }
}

export class InventoryOutOfStockEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date;

  constructor(
    public readonly aggregateId: string,
    public readonly restaurantId: string
  ) {
    this.dateTimeOccurred = new Date();
  }

  public getAggregateId(): string {
    return this.aggregateId;
  }
}

export class InventoryExpiredBatchDetectedEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date;

  constructor(
    public readonly aggregateId: string,
    public readonly restaurantId: string,
    public readonly batchId: string,
    public readonly quantity: number
  ) {
    this.dateTimeOccurred = new Date();
  }

  public getAggregateId(): string {
    return this.aggregateId;
  }
}
