import { Entity } from '@saas/core';
import { SafetyStock } from '../value-objects/safety-stock.value-object';
import { MinimumStock } from '../value-objects/minimum-stock.value-object';
import { MaximumStock } from '../value-objects/maximum-stock.value-object';
import { ReorderLevel } from '../value-objects/reorder-level.value-object';

export interface InventoryThresholdProps {
  id: string;
  inventoryId: string;
  safetyStock?: SafetyStock;
  minimumStock?: MinimumStock;
  maximumStock?: MaximumStock;
  reorderLevel?: ReorderLevel;
}

export class InventoryThreshold extends Entity<InventoryThresholdProps> {
  get id(): string {
    return this._id;
  }

  get inventoryId(): string {
    return this.props.inventoryId;
  }

  get safetyStock(): SafetyStock | undefined {
    return this.props.safetyStock;
  }

  get minimumStock(): MinimumStock | undefined {
    return this.props.minimumStock;
  }

  get maximumStock(): MaximumStock | undefined {
    return this.props.maximumStock;
  }

  get reorderLevel(): ReorderLevel | undefined {
    return this.props.reorderLevel;
  }

  public static create(props: InventoryThresholdProps): InventoryThreshold {
    if (props.minimumStock && props.maximumStock) {
      if (props.minimumStock.quantity.value > props.maximumStock.quantity.value) {
        throw new Error('Minimum stock cannot be greater than maximum stock');
      }
    }

    return new InventoryThreshold(props.id, props);
  }
}
