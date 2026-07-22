import { DomainEvent } from '@saas/core';

export abstract class BaseInventoryIntegrationEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date;

  constructor(
    public readonly aggregateId: string,
    public readonly correlationId: string,
    public readonly payload: any
  ) {
    this.dateTimeOccurred = new Date();
  }

  public getAggregateId(): string {
    return this.aggregateId;
  }
}

export class InventoryIntegrationStartedEvent extends BaseInventoryIntegrationEvent {
  constructor(aggregateId: string, correlationId: string, payload: any) {
    super(aggregateId, correlationId, payload);
  }
}

export class InventoryIntegrationCompletedEvent extends BaseInventoryIntegrationEvent {
  constructor(aggregateId: string, correlationId: string, payload: any) {
    super(aggregateId, correlationId, payload);
  }
}

export class InventoryIntegrationFailedEvent extends BaseInventoryIntegrationEvent {
  constructor(aggregateId: string, correlationId: string, payload: any, public readonly reason: string) {
    super(aggregateId, correlationId, payload);
  }
}
