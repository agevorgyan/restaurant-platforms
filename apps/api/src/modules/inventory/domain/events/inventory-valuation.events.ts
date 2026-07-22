import { DomainEvent } from '@saas/core';
import { CostSnapshot } from '../value-objects/cost-snapshot.value-object';
import { InventoryValue } from '../value-objects/inventory-value.value-object';
import { InventoryCost } from '../value-objects/inventory-cost.value-object';
import { ValuationMethodEnum } from '../value-objects/valuation-method.value-object';

abstract class BaseValuationEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date;

  constructor(public readonly aggregateId: string) {
    this.dateTimeOccurred = new Date();
  }

  public getAggregateId(): string {
    return this.aggregateId;
  }
}

export class InventoryValuationCalculatedEvent extends BaseValuationEvent {
  constructor(
    public readonly inventoryId: string,
    public readonly totalValue: InventoryValue,
    public readonly method: ValuationMethodEnum
  ) {
    super(inventoryId);
  }
}

export class InventoryCostCalculatedEvent extends BaseValuationEvent {
  constructor(
    public readonly inventoryId: string,
    public readonly unitCost: InventoryCost,
    public readonly method: ValuationMethodEnum
  ) {
    super(inventoryId);
  }
}

export class CostSnapshotCreatedEvent extends BaseValuationEvent {
  constructor(
    public readonly inventoryId: string,
    public readonly snapshot: CostSnapshot
  ) {
    super(inventoryId);
  }
}
