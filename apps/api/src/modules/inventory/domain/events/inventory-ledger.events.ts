import { DomainEvent } from '@saas/core';


abstract class BaseLedgerEvent implements DomainEvent {
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

export class InventoryLedgerCreatedEvent extends BaseLedgerEvent {
  constructor(
    aggregateId: string,
    restaurantId: string,
    public readonly inventoryId: string,
    public readonly ingredientId: string
  ) {
    super(aggregateId, restaurantId);
  }
}

export class StockReceivedEvent extends BaseLedgerEvent {
  constructor(
    aggregateId: string,
    restaurantId: string,
    public readonly movementId: string,
    public readonly quantity: number
  ) {
    super(aggregateId, restaurantId);
  }
}

export class StockConsumedEvent extends BaseLedgerEvent {
  constructor(
    aggregateId: string,
    restaurantId: string,
    public readonly movementId: string,
    public readonly quantity: number
  ) {
    super(aggregateId, restaurantId);
  }
}

export class ReservationRecordedEvent extends BaseLedgerEvent {
  constructor(
    aggregateId: string,
    restaurantId: string,
    public readonly movementId: string,
    public readonly quantity: number
  ) {
    super(aggregateId, restaurantId);
  }
}

export class ReservationReleasedEvent extends BaseLedgerEvent {
  constructor(
    aggregateId: string,
    restaurantId: string,
    public readonly movementId: string,
    public readonly quantity: number
  ) {
    super(aggregateId, restaurantId);
  }
}

export class WasteRecordedEvent extends BaseLedgerEvent {
  constructor(
    aggregateId: string,
    restaurantId: string,
    public readonly movementId: string,
    public readonly quantity: number
  ) {
    super(aggregateId, restaurantId);
  }
}

export class StockAdjustedEvent extends BaseLedgerEvent {
  constructor(
    aggregateId: string,
    restaurantId: string,
    public readonly movementId: string,
    public readonly quantity: number
  ) {
    super(aggregateId, restaurantId);
  }
}

export class StockTransferredEvent extends BaseLedgerEvent {
  constructor(
    aggregateId: string,
    restaurantId: string,
    public readonly movementId: string,
    public readonly quantity: number
  ) {
    super(aggregateId, restaurantId);
  }
}

export class StockReturnedEvent extends BaseLedgerEvent {
  constructor(
    aggregateId: string,
    restaurantId: string,
    public readonly movementId: string,
    public readonly quantity: number
  ) {
    super(aggregateId, restaurantId);
  }
}

export class StockExpiredEvent extends BaseLedgerEvent {
  constructor(
    aggregateId: string,
    restaurantId: string,
    public readonly movementId: string,
    public readonly quantity: number
  ) {
    super(aggregateId, restaurantId);
  }
}
