import { DomainEvent } from '@saas/core';

abstract class BaseEngineEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date;

  constructor(
    public readonly aggregateId: string, // Can be InventoryId or OrderId depending on context
    public readonly restaurantId: string
  ) {
    this.dateTimeOccurred = new Date();
  }

  public getAggregateId(): string {
    return this.aggregateId;
  }
}

export class InventoryReservedEvent extends BaseEngineEvent {
  constructor(
    aggregateId: string,
    restaurantId: string,
    public readonly inventoryId: string,
    public readonly orderId: string,
    public readonly quantity: number
  ) {
    super(aggregateId, restaurantId);
  }
}

export class ReservationReleasedEvent extends BaseEngineEvent {
  constructor(
    aggregateId: string,
    restaurantId: string,
    public readonly inventoryId: string,
    public readonly orderId: string,
    public readonly quantity: number
  ) {
    super(aggregateId, restaurantId);
  }
}

export class ReservationExpiredEvent extends BaseEngineEvent {
  constructor(
    aggregateId: string,
    restaurantId: string,
    public readonly inventoryId: string,
    public readonly orderId: string,
    public readonly quantity: number
  ) {
    super(aggregateId, restaurantId);
  }
}

export class InventoryAllocatedEvent extends BaseEngineEvent {
  constructor(
    aggregateId: string,
    restaurantId: string,
    public readonly inventoryId: string,
    public readonly orderId: string,
    public readonly quantity: number,
    public readonly batchId?: string
  ) {
    super(aggregateId, restaurantId);
  }
}

export class AllocationCompletedEvent extends BaseEngineEvent {
  constructor(
    aggregateId: string,
    restaurantId: string,
    public readonly inventoryId: string,
    public readonly orderId: string,
    public readonly totalAllocated: number
  ) {
    super(aggregateId, restaurantId);
  }
}

export class AllocationFailedEvent extends BaseEngineEvent {
  constructor(
    aggregateId: string,
    restaurantId: string,
    public readonly inventoryId: string,
    public readonly orderId: string,
    public readonly requestedQuantity: number,
    public readonly reason: string
  ) {
    super(aggregateId, restaurantId);
  }
}
