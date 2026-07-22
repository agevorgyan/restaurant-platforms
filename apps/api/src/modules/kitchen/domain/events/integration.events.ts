import { DomainEvent } from '@saas/core';
import { ConsumptionRequest } from '../value-objects/integration/consumption-request.value-object';
import { ReservationRequestReference } from '../value-objects/integration/reservation-request-reference.value-object';
import { AllocationReference } from '../value-objects/integration/allocation-reference.value-object';
import { InventoryRequestReference } from '../value-objects/integration/inventory-request-reference.value-object';
import { InventoryResponseReference } from '../value-objects/integration/inventory-response-reference.value-object';

export class KitchenInventoryReservationRequestedEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date = new Date();

  constructor(
    public readonly request: ReservationRequestReference
  ) {}

  public getAggregateId(): string {
    return this.request.reference.correlationId;
  }
}

export class KitchenInventoryConsumptionRequestedEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date = new Date();

  constructor(
    public readonly request: ConsumptionRequest
  ) {}

  public getAggregateId(): string {
    return this.request.reference.correlationId;
  }
}

export class KitchenInventoryAllocationRequestedEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date = new Date();

  constructor(
    public readonly reference: AllocationReference
  ) {}

  public getAggregateId(): string {
    return this.reference.reference.correlationId;
  }
}

export class KitchenInventoryReleaseRequestedEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date = new Date();

  constructor(
    public readonly requestReference: InventoryRequestReference,
    public readonly reason: string
  ) {}

  public getAggregateId(): string {
    return this.requestReference.correlationId;
  }
}

export class KitchenInventoryIntegrationCompletedEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date = new Date();

  constructor(
    public readonly response: InventoryResponseReference
  ) {}

  public getAggregateId(): string {
    return this.response.correlationId;
  }
}

export class KitchenInventoryIntegrationFailedEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date = new Date();

  constructor(
    public readonly response: InventoryResponseReference
  ) {}

  public getAggregateId(): string {
    return this.response.correlationId;
  }
}
